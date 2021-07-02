const axios = require('axios')
const User = require("../Database/model/User")

module.exports = async(req, res) => {
  if (req.headers.authorization) {
    let access_token = req.headers.authorization
    if(req.headers.sns === 'kakao'){
      await axios.get('https://kapi.kakao.com/v2/user/me',{
        headers:{
          'authorization':access_token
        }
      }).then(async (kakaoData)=>{
        let userInfo = await User.findOne({'email':kakaoData.data.kakao_account.email})

        if(!userInfo) {  
          res.status(401).send('invalid token')
        }else{
          let allList = userInfo.list

          for(let i in allList){   // 받아온 id 값을 기준으로 list 배열에서 삭제
            if(allList[i].id === req.body.id){
              delete allList[i]
              break;  // id값은 중복될 수 없음 불필요한 연산 제거
            }
          }

          allList = allList.filter((item)=>{
            return 'empty' !== item || 'undefined' !== item
          })

          User.updateOne({'email':userInfo.email},{
            $set:{'list':allList}
          }).then(res.status(200).send('삭제되었습니다'))
          .catch(err => console.log('Controller/BucketDelte DB ERROR', err))
        }
      })
    }else if(req.headers.sns === 'google'){
      await axios('https://www.googleapis.com/oauth2/v3/userinfo',
      {
        method:'GET',
        headers:{
          'Authorization':access_token
        }
      }).then(async (googleData) => {
        let userInfo = await User.findOne({'email':googleData.data.email})

        if(!userInfo){
          res.status(401).send('invalid token')
        }else{
          let allList = userInfo.list
          delete allList[req.body.bucketid]

          allList = allList.filter((item)=>{
            return 'empty' !== item || 'undefined' !== item
          })

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