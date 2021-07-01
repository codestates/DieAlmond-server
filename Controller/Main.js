const axios = require('axios')
const User = require('../Database/model/User')

module.exports = async (req,res)=>{

  if(req.headers.authorization){  //토큰 있음
    let access_token = req.headers.authorization
    if(req.headers.sns === 'kakao'){     ///////////////////////////////kakao
      await axios.get('https://kapi.kakao.com/v2/user/me',{
        headers:{
          'authorization':access_token
        }
      }).then( async (kakaoData) => {
        let userInfo = await User.findOne({'email':kakaoData.data.kakao_account.email})

        if(!userInfo){  //없으면
          res.status(401).send({'code':401,'msg':'not authorization token'})
        }else{
          res.status(200).send({'userinfo':userInfo,'msg':'success'})
        }
      }).catch((err) => {
        console.log('Controller/Main :22 axios ERROR:',err)
        if(err.response.status === 400){
          res.status(400).send({'code':400,'msg':err.response.statusText})
        }else if(err.response.status === 401){
          res.status(401).send({'code':401,'msg':err.response.statusText})
        }
      })
    }else if(req.headers.sns === 'google'){   ///////////////////////////google
      await axios('https://www.googleapis.com/oauth2/v3/userinfo',
      {
        method:'GET',
        headers:{
          'Authorization':access_token
        }
      }).then( async (googleData) => {
        let userInfo = await User.findOne({'email':googleData.data.email})
        
        if(!userInfo){
          res.status(401).send({'code':401,'msg':'not authorization token'})
        }else{
          res.status(200).send({'userinfo':userInfo,'msg':'success'})
        }
      }).catch((err) => {
        console.log('Controller/Main :39 axios ERROR:',err)
        if(err.response.status === 400){
          res.status(400).send({'code':400,'msg':err.response.statusText})
        }else if(err.response.status === 401){
          res.status(401).send({'code':401,'msg':err.response.statusText})
        }
      })
    }else{
      res.status(400).send({'code':401,'msg':'Unknown sns Token'}) 
    }

  }else{
    res.status(401).send({'code':401,'msg':'not found token'})
  }
}

