const axios = require('axios')
const BucketList = require('../Database/Model/BucketList')
const User = require("../Database/Model/User")
const userDataRemover = require('../middleware/UserDataRemover')


module.exports = async(req, res) => {
  console.log('reqreq', req)
  if (req.headers.authorization) {
    let access_token = req.headers.authorization
    console.log('accccc',access_token)
    if(req.headers.sns === 'kakao'){ ////////////////////////////kakao
      await axios.get('https://kapi.kakao.com/v2/user/me',{
        headers:{
          'authorization':access_token
        }
      }).then(async (kakaoData)=>{
        let userInfo = await User.findOne({'email':kakaoData.data.kakao_account.email})
        

        if(!userInfo) {  
          res.status(401).send('invalid token')
        }else{  ////////////////////////////////////////  delete user.list    target
          let allList = userDataRemover(userInfo.list, req.body.id) 
          BucketList.deleteOne({'id':req.body.id}).catch(err=>{
            console.log('Controller/BucketDelete :23 db ERROR',err)
            res.send('잠시 후 다시 시도해주세요')
          })
          //공유된 버킷리스트 데이터 삭제.

          User.updateOne({'email':userInfo.email},{
            $set:{'list':allList}
          }).then(res.status(200).send('삭제되었습니다'))
          .catch(err => console.log('Controller/BucketDelte DB ERROR', err))
        }
      })
    }else if(req.headers.sns === 'google'){  ////////////////////////google
      await axios('https://www.googleapis.com/oauth2/v3/userinfo',
      {
        method:'GET',
        headers:{
          'Authorization':access_token
        }
      }).then(async (googleData) => {
        console.log(googleData)
        let userInfo = await User.findOne({'email':googleData.data.email})
        console.log('fjiowejfaweoi',userInfo)
        if(!userInfo){
          res.status(401).send('invalid token')
        }else{  ////////////////////////////////////////  delete user.list    target
          let allList = userDataRemover(userInfo.list, req.body.id)
          BucketList.deleteOne({'id':req.body.id}).catch('Controller/BucketDelete :23 db ERROR')
          //공유된 버킷리스트 데이터 삭제.

          User.updateOne({'email':userInfo.email},{
            $set:{'list':allList}
          }).then(res.status(200).send('삭제되었습니다'))
          .catch(err => console.log('Controller/BucketDelte DB ERROR', err))
        }
      })
    }
  } else {
    res.status(400).send({'code':400,'msg':'not found token'})
  }
}