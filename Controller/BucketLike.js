const tokenVerify = require('../middleware/TokenVerify')
const User = require('../Database/Model/User')
const BucketList = require('../Database/Model/BucketList')
const remover = require('../middleware/UserDataRemover')  // id라는 key 를 포함하는 객체를 가진 1차원 배열의 요소 삭제
const dataUpdate = require('../middleware/DataUpdate')  // 파라미터에 해당하는 model에서 특정데이터 업데이트
const myListTargetLike = require('../middleware/MyListTargetLike')


module.exports = async (req, res) => {
  const verifyData = await tokenVerify(req,res)
  

  let userinfo = await User.findOne({'email':verifyData.email})
  let targetBucket = await BucketList.findOne({'id':req.body.bucketid})
  let targetUser = await User.findOne({'nickname':targetBucket.author})
  let checkLike = false;
  
  
  for(let i in targetBucket.like){
    if(targetBucket.like[i].id === userinfo.nickname){ // nickname or email or id 등 고유한 값 
      checkLike = true
      break;
    }
  }  // 이미 해당 게시물에 좋아요 했는지 안했는지 확인

  
  if(userinfo){
    let like
    let likedList

    if(checkLike){ //이미 좋아요를 눌렀는데 다시 같은 요청이오면 좋아요 취소.
      like = remover(targetBucket.like, userinfo.nickname)  // 배열의 특정 요소 삭제해주는 함수 (*단 1차원 배열속 객체 형태여야함 + id key가 있어야함*)
      await dataUpdate(req,BucketList,'like',like)  //dataUpdate 함수는 5개의 파라미터를 받아서 문자열을 기준으로 조회 후 변경해줌
      .then(                                       // 5 번째 파라미터는 옵션임 내용이 없다면 bucketList 수정, option이 입력됬다면 user 수정 
        likedList = remover(userinfo.likedList, req.body.bucketid),
        await dataUpdate(req,User,'likedList',likedList,userinfo)
        .then(
          await myListTargetLike(req,userinfo,targetUser,'remove')
          .then(res.status(200).send('좋아요 취소'))
          )
      )
    }else{
      like = [...targetBucket.like, {'id':userinfo.nickname}] // 좋아요 누르는 부분, remover 함수를 사용하려면 id key가 포함된 객체여야함
      await dataUpdate(req,BucketList,'like',like)
      .then(
        likedList = [...userinfo.likedList,{'id':req.body.bucketid}],
        await dataUpdate(req,User,'likedList',likedList,userinfo)
        .then(
          await myListTargetLike(req,userinfo,targetUser)
          .then(res.status(200).send('좋아요 성공'))
        )
      )
    }
  }else{
    res.status(400).send('invalid token')
  }
}

// 좋아요를 누르면 좋아요 누른 해당 버킷id를 db에서 찾는다. 그 후 찾았으면 해당 버킷의like배열에 
// 좋아요누른 user의 닉네임, email 등등을 넣는다. 좋아요 누른 버킷의 like배열속에 user.id가 없을 때.
// 만약 있다면 좋아요 취소해야함. 