// User의 list[n].nickname 을 req.body.nickname 으로 변경
// User.list[n].id === BucketList[n].id 를 찾아서 BucketList[n]
// BucketList[n].author 를 req.body.nickname으로 변경
// BucketList[n].like[n].id 를 req.body.nickname 으로 변경

const User = require('../Database/Model/User')
const BucketList = require('../Database/Model/BucketList')


module.exports = async (req,userInfo) => {
  
  
  console.log('작동됨')
  let list = userInfo.list
  if(userInfo.list.length >= 1){  // 리스트에 무언가 있음 = 내가 추가한 리스트가 있음
    for(let i in list){
      list[i].nickName = req.body.nickName
    }
    await User.updateOne({'email':userInfo.email},
    {
      $set:{'list':list}
    }).then(
      
    )
    await BucketList.updateMany({'author':userInfo.nickname},
    {
      $set:{'author':req.body.nickName}   // 닉변하면 버킷리스트 author 변경
    })
  }
  if(userInfo.likedList.length >= 1){  // 유저가 좋아요한 게시물이 하나라도 있다면
    for(let i in userInfo.likedList){
      console.log('버킷리스트 부분')
      let targetBucket = await BucketList.findOne({'id':userInfo.likedList[i].id})  // 유저가 좋아요한 게시물을 bucketList에서 찾음
      console.log(targetBucket,"targetBucket")
      let like = targetBucket.like   // 해당 게시물의 좋아요한 사람 목록
      console.log(like,"like")
      for(let k in like){  // 목록을 조회해서 현재 유저의 닉네임과 같은 것을 찾음
        console.log(i,'i')
        console.log(like[k],'라이크 i번째')
        if(like[k].id === userInfo.nickname){  // 목표 게시물의 좋아요 리스트에서 해당하는 유저의 닉네임이 나온다면
          console.log(userInfo.likedList[i],'userInfo.likedList')
          like[k].id = req.body.nickName  // 해당 닉네임을 변경하려는 닉네임으로 바꿈
          console.log(like[k].id,req.body.nickName,"like[i].id = req.body.nickName")
          console.log(userInfo.likedList[i].id,"여기 여기")
          console.log(userInfo.likedList[i].id)
          await BucketList.updateOne({'id':userInfo.likedList[i].id},  // 유저가 좋아요한 리스트에서 n번째 요소 id와 같은 도큐먼트가 있다면 업데이트함
          {
            $set:{'like':like}  
          }).catch(err => console.log(err))
          break;   // 좋아요는 한번만 할 수 있음. like 배열에서 해당하는 닉네임을 찾았다면 뒤에 몇개가 있던 볼 필요가 없음 불필요한 연산 방지
        }
      }
    } 
  }
}


