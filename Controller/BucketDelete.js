const axios = require('axios')
const BucketList = require('../Database/Model/BucketList')
const User = require("../Database/Model/User")
const userDataRemover = require('../middleware/UserDataRemover')




module.exports = async(req, res) => {
  if (req.headers.authorization) {
    let access_token = req.headers.authorization
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
        let userInfo = await User.findOne({'email':googleData.data.email})
        if(!userInfo){
          res.status(401).send('invalid token')
        }else{  ////////////////////////////////////////  delete user.list    target
          let allList = userDataRemover(userInfo.list, req.body.id)
          await BucketList.findOne({'id':req.body.id})
          .then(async (data)=>{
            for(let i in data.like){
              let targetInfo = await User.findOne({'nickname':data.like[i].id})
              let likedlist = await userDataRemover(targetInfo.likedList,String(req.body.id))
              await User.updateOne({'nickname':targetInfo.nickname},
              {
                $set:{'likedList':likedlist}
              })
            }
          })
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


// 게시물 삭제 시 해당 게시물의 like 배열을 조회 후 좋아요한 사람의 아이디를 찾으러 간다
// for문으로 User.find(nickname:like[0]) 을 하고 likedList remover(likedList,req.body.id)
// $set:likedList:likedList 로 바꾼다.