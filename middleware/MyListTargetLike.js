const User = require('../Database/Model/User')
const remover = require('../middleware/UserDataRemover')

module.exports = async (req,userinfo,targetUser,option) => {
  let like
  
  for(let i in userinfo.list){
    if(targetUser.list[i].bucketid === req.body.bucketid){
      if(!option){
        like = [...targetUser.list[i].like,{'id':userinfo.nickname}]
      }else{
        like = remover(targetUser.list[i].like,userinfo.nickname)
      }
      // targetUser는 해당 게시물의 주인, userinfo는 해당 게시물을 누른 타인 게시물주인의 targetlist에 좋아요 누른 타인의 닉네임을 등록 
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
