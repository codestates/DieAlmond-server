// User의 list[n].nickname 을 req.body.nickname 으로 변경
// User.list[n].id === BucketList[n].id 를 찾아서 BucketList[n]
// BucketList[n].author 를 req.body.nickname으로 변경
// BucketList[n].like[n].id 를 req.body.nickname 으로 변경

const User = require('../Database/Model/User')
const BucketList = require('../Database/Model/BucketList')


module.exports = async (req,userInfo,bucketList) => {
  console.log('작동됨')
  let list = userInfo.list
  console.log(userInfo.list,"userinfo.list")
  console.log(userInfo.likedList,"userinfo.likedList")
  if(userInfo.list.length >= 1){  // 리스트에 무언가 있음 = 내가 추가한 리스트가 있음
    console.log('if문 걸림')
    for(let i in list){
      console.log('list 닉네임 변경 for문')
      list[i].nickName = req.body.nickName
    }
    await User.updateOne({'email':userInfo.email},
    {
      $set:{'list':list}
    })
    await BucketList.updateMany({'author':userInfo.nickname},
    {
      $set:{'author':req.body.nickName}   // 닉변하면 버킷리스트 author 변경
    })
  }

  if(userInfo.likedList.length >= 1){
    for(let i in userInfo.likedList){
      console.log('버킷리스트 부분')
      let targetBucket = await BucketList.findOne({'id':userInfo.likedList[i].id})
      console.log(targetBucket,"여기")
      let like = targetBucket.like
      for(let i in like){
        console.log(i,'i')
        console.log(like[i],'like[i]')
        console.log(userInfo.nickname,'userinfo.nickname')
        if(like[i].id === userInfo.nickname){
          like[i].id = req.body.nickName
          console.log(req.body,"req.body -<<<")
          console.log(like[i], req.body.nickName,"if문")
          await BucketList.updateOne({'id':userInfo.likedList[i].id},
          {
            $set:{'like':like}
          })
        }
      }
    } 
  }
}


