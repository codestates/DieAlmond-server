const tokenVerify = require('../middleware/TokenVerify')
const User = require('../Database/Model/User')

module.exports = async (req, res) => {
  let verifyData = await tokenVerify(req,res) // 토큰 해독
  
    let userinfo = await User.findOne({ 'email': verifyData.email })

    if(userinfo){
      let checkedList = []
      // userinfo에서 반복문을 돈다. userinfo[i].list.isChecked === false 인 것만 보내주기
      for (let i in userinfo.list) {
        if (userinfo.list[i].isChecked === false) {
          checkedList.push(userinfo.list[i])   //체크된 항목들만 배열에 담는다
        }
      }
      res.status(200).send({ 'checkedList': checkedList }) // 클라이언트에 보냄
    }

}

//     /Bucket/checked

// 버킷리스트 체크 안된거 보내주기