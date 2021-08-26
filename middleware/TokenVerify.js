const axios = require('axios')

module.exports = async (req,res) => {
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
        
      }).catch((err) =>{
        res.status(err.response.status).send({'code':err.response.status,'msg':err.response.statusText})
      })
      return data
    }else if(req.headers.sns === 'kakao'){
      await axios.get('https://kapi.kakao.com/v2/user/me',{
        headers:{
          'authorization':access_token
        }
      }).then((kakaoData)=>{
        data = kakaoData.data.kakao_account
      }).catch((err) =>{
        res.status(err.response.status).send({'code':err.response.status,'msg':err.response.statusText})
      })
      return data
    }else if(0){ //add example
      //add sns facebook,github ...
    }
  }
  // facebookVerify:(req,res){
  // }
}

