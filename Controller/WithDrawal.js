const axios = require("axios")
const User = require('../Database/Model/User')
const BucketList = require('../Database/Model/BucketList')
const allRemover = require('../middleware/AllRemover')

module.exports = async (req, res) => {
  console.log(req)
  if (req.headers.authorization) {
    let access_token = req.headers.authorization
    if (req.headers.sns === 'kakao') {   ///////////////////////////kakao
      await axios.get('https://kapi.kakao.com/v2/user/me', {
        headers: {
          'authorization': access_token
        }
      }).then(async (kakaoData) => {
        let userInfo = await User.findOne({ 'email': kakaoData.data.kakao_account.email })
        if (!userInfo) {
          res.send(401).send('invalid token')
        } else {
          // userInfo에 매칭되는 userInfo.list[n].id 를 bucketlist에서 다삭제
          allRemover(userInfo.list)
          User.deleteOne({ 'email': userInfo.email }).then(res.status(200).send('회원탈퇴 되었습니다'))
        }
      }).catch(err => {
        console.log('Controller/WithDrawal :22 axios ERROR', err)
        res.send('axios err')
      })
    } else if (req.headers.sns === 'google') { //////////////////////google
        await axios('https://www.googleapis.com/oauth2/v3/userinfo',
        {
          method:'GET',
          headers:{
            'Authorization':access_token
          }
        }).then(async (googleData) => {  // axios success
          let userInfo = await User.findOne({'email':googleData.data.email})
          if(!userInfo){
            res.status(401).send('invalid token')
          }else{
            allRemover(userInfo.list)
            User.deleteOne({ 'email': userInfo.email }).then(res.status(200).send('회원탈퇴 되었습니다'))
          }
        }).catch(err => { //axios fail
          console.log('Controller/WithDrawal :43 axios ERROR', err)
          res.send('axios err')
        }) //////////////////////////아래 에러 핸들링
    }else {
      res.status(400).send({ 'code': 401, 'msg': 'Unknown sns Token' })  // 
    }
  }else {   // not found token    
    res.status(400).send({ 'code': 400, 'msg': 'not found token' })  //
  }
}