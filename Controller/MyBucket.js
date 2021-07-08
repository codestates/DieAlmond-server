const axios = require('axios')
const User = require('../Database/Model/User')

module.exports = async (req, res) => {
  if (req.headers.authorization) {
    let access_token = req.headers.authorization

    if (req.headers.sns === 'kakao') {  ////////////////////////kakao
      await axios.get('https://kapi.kakao.com/v2/user/me', {
        headers: {
          'authorization': access_token
        }
      }).then(async (kakaoData) => {
        let userInfo = await User.findOne({ 'email': kakaoData.data.kakao_account.email })
        if (!userInfo) {
          res.status(401).send('invalid token')
        } else {
          res.status(200).send({user:{'bucketlist':userInfo.list}, 'msg': 'success' })
        }
      }).catch((err) => {
        console.log('Controller/MyBucket :20 axios ERROR', err)
        if (err.response.status === 401) {
          res.status(401).send({ code: 401, 'msg': err.response.statusText }) //Unauthorized  
        } else if (err.response.status === 403) {
          res.status(403).send({ code: 403, 'msg': err.response.statusText })
        }
      })
    } else if (req.headers.sns === 'google') { ///////////////////////////////google
      await axios('https://www.googleapis.com/oauth2/v3/userinfo',
        {
          method: 'GET',
          headers: {
            'Authorization': access_token
          }
        }).then(async (googleData) => {
          console.log('ㅇㅡ아아아아아아앙', googleData)
          let userInfo = await User.findOne({ 'email': googleData.data.email })
          console.log('userinfofofoo', userInfo)
          if (!userInfo) {
            res.status(401).send('invalid token')
          } else {
            res.status(200).send({'user':{ 'bucketlist': userInfo.list},'msg': 'success' })
          }
        }).catch((err) => {  //axios error handle
          console.log('Controller/MyBucket :36 axios ERROR', err)
          if (err.response.status === 401) {
            res.status(401).send({ code: 401, 'msg': err.response.statusText }) //Unauthorized  
          } else if (err.response.status === 403) {
            res.status(403).send({ code: 403, 'msg': err.response.statusText })
          }
        })
    }
  } else {
    res.status(400).send('not found token')
  }
}