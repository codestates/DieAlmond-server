const axios = require('axios')


module.exports = async (req) => {
  let data = ''
  if(req.headers.authorization){  // 토큰이 있다면
    let access_token = req.headers.authorization
    if(req.headers.sns === 'google'){
      await axios('https://www.googleapis.com/oauth2/v3/userinfo',
      {
        method:'GET',
        headers:{
          'Authorization':access_token
        }
      }).then((googleData)=>{
        data = googleData.data
      })
      return data
    }else if(req.headers.sns === 'kakao'){
      await axios.get('https://kapi.kakao.com/v2/user/me',{
        headers:{
          'authorization':access_token
        }
      }).then((kakaoData)=>{
        data = kakaoData.data.kakao_account
      })
      return data
    }else{
      return 401  // not exist (req.headers.sns)
    }
  }else{
    return 400  // (req.headers.authorization)
  }
  // facebookVerify:(req,res){
  // }
}

