// User의 list[n].nickname 을 req.body.nickname 으로 변경
// User.list[n].id === BucketList[n].id 를 찾아서 BucketList[n]
// BucketList[n].author 를 req.body.nickname으로 변경
// BucketList[n].like[n].id 를 req.body.nickname 으로 변경

const User = require('../Database/Model/User')
const BucketList = require('../Database/Model/BucketList')

module.exports = async (req,userinfo) => {
  let list = userinfo.list
  if(userinfo.list.length >= 1){  // 리스트에 무언가 있음 = 내가 추가한 리스트가 있음
    for(let i in list){
      list[i].nickName =  req.body.nickName
    }
    await User.updateOne({'email':userinfo.email},
    {
      $set:{'list':list}
    })
  }else{
    return
  }
}