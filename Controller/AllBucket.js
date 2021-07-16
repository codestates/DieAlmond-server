const tokenVerify = require('../middleware/TokenVerify')
const BucketList = require('../Database/Model/BucketList')
const User = require('../Database/Model/User')

module.exports = async (req, res) => {
  let verifyData = await tokenVerify(req,res)

  let userinfo = await User.findOne({'email':verifyData.email})
  let listAll = await BucketList.find({}).sort({'id':-1})
  
  if(userinfo){
    res.status(200).send({'bucketList':listAll})
  }else{
    res.status(400).send('invalid token')
  }
}
// 모든 버킷리스트 보여줌 ex 1번째부터 10번째까지,다음버튼 누르면 2~20까지 or 모든 리스트 싹다