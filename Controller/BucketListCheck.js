const tokenVerify = require('../middleware/TokenVerify')
const User = require('../Database/Model/User')


module.exports = async (req, res) => {
  const verifyData = await tokenVerify(req)
  let userinfo = await User.findOne({ 'email': verifyData.email })
  console.log('************', req)
  console.log('************userinfoo', userinfo)

  if (userinfo) {  // 토큰으로 유저를 찾음
    for (let i in userinfo.list) {  //userinfo.list 라는 배열을 돌면서 체크할 target을 찾음
      let checkInfo =
      userinfo.list[i].id === req.body.id  //조건

      if (checkInfo) {  //조건에 맞는 target을 찾았다면
        userinfo.list[i].isChecked = req.body.isChecked // target의.isChecked를 요청받은 요소로 변경 true or false
        User.updateOne({ 'email': userinfo.email },
          {
            $set: { 'list': userinfo.list }
          }).then(res.status(200).send('변경 되었습니다'))
        break;
      }
    }
    // res.send('check request.id,nickname,bucketname': test')
  }
}



