const tokenVerify = require('../middleware/TokenVerify')
const User = require('../Database/model/User')
const BucketList = require('../Database/model/BucketList')
const remover = require('../middleware/UserDataRemover')

module.exports = async (req, res) => {
  const verifyData = await tokenVerify(req,res)
  
  let userinfo = await User.findOne({'email':verifyData.email})
  let targetBucket = await BucketList.findOne({'id':req.body.bucketid})
  let checkLike = false;
  
  for(let i in targetBucket.like){
    if(targetBucket.like[i] === userinfo.nickcname){ // nickname or email or id 등 고유한 값 
      checkLike = true
      break;
    }
  }  // 이미 해당 게시물에 좋아요 했는지 안했는지 확인
  console.log(checkLike,"배열에 아무것도 없음")
  if(userinfo){
    let allLike
     //nickname or email or id 고유한 값 넣으면됨
    if(checkLike){ //이미 좋아요를 눌렀는데 다시 해당버킷으로 요청이오면 좋아요 취소.
      allLike = remover(targetBucket.like,userinfo.nickname)  // 배열의 특정요소 삭제해주는 커스텀 미들웨어
      console.log(allLike,"요소가 있어서 삭제함")
      await BucketList.updateOne({'id':req.body.bucketid},
      {
        $set:{'like':allLike}
      }).then(res.status(200).send('좋아요 취소'))
    }else{
      allLike = [...targetBucket.like, userinfo.nickname]
      console.log(allLike,"요소가 없어서 추가함")
      await BucketList.updateOne({'id':req.body.bucketid},
      {
        $set:{'like':allLike}
      }).then(res.status(200).send('좋아요 성공'))
    }
  }else{
    res.status(400).send('invalid token')
  }
}

// 좋아요를 누르면 좋아요 누른 해당 버킷id를 db에서 찾는다. 그 후 찾았으면 해당 버킷의like배열에 
// 좋아요누른 user의 닉네임, email 등등을 넣는다. 좋아요 누른 버킷의 like배열속에 user.id가 없을 때.
// 만약 있다면 좋아요 취소해야함. 