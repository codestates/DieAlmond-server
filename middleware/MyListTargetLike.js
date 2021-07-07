const User = require('../Database/Model/User')
const remover = require('../middleware/UserDataRemover')
//targetUser 는 좋아요 누른 게시물의 주인
// userinfo 는 좋아요를 누른 사람



module.exports = async (req,userinfo,targetUser,option) => {
  let like
  
  for(let i in userinfo.list){
    if(targetUser.list[i].bucketid === req.body.bucketid){ // 게시물 주인의 list에서 요청으로 받은 id와 같은게 있는지 찾음
      if(!option){  //찾았다면 option 유무에 따라 지우거나 추가
        like = [...targetUser.list[i].like,{'id':userinfo.nickname}] 
      }else{ // 옵션에 무언가 들어있다면 remove명령
        like = remover(targetUser.list[i].like,userinfo.nickname)
      }
      
      targetUser.list[i].like = like // 수정된 like로 변경
      await User.updateOne({'email':targetUser.email},
      {
        $set:{'list':targetUser.list}
      })
      break;
    }
  }
}

// 우선 target 유저 userinfo 에서 list 배열을 순회한다.
// list 배열의 [i].bucketid === req.body.bucketid 인것을 찾는다 찾은 후 
// 해당 리스트에서 like 를 구조분해 한다. [...like,{'id':req.body.bucketid}] 로 만든다
// 그 후 list[i].bucketid === req.body.buckid 인것의 .like를 새로만든 like로 만든다

// 삭제는 remover(like,id) 를 한 후 그 리스트를 like에 넣는다
