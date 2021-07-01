const axios = require('axios')
const User = require('../Database/model/User')

module.exports = async (req, res) => {
  if (req.headers.authorization) {
    let access_token = req.headers.authorization

    if (req.headers.sns === 'kakao') {
      await axios.get('https://kapi.kakao.com/v2/user/me', {
        headers: {
          'authorization': access_token
        }
      }).then(async (kakaoData) => {
        let userInfo = await User.findOne({ 'email': kakaoData.data.kakao_account.email })
        if (!userInfo) {
          res.status(401).send('invalid token')
        } else {
          let allList = userInfo.list
          allList.push({ ...req.body, isChecked: false }) //기존 배열에 받은 객체를 넣음
          User.updateOne({ 'email': userInfo.email },
            {
              $set: { 'list': allList }
            }).then(res.status(200).send({ 'msg': '추가되었습니다' })).catch(err => console.log('Controller/BucketAdd : 26 DB ERROR', err))
        }
      }).catch(err => { //axios Error check api request headers
        console.log('Contoller/BucketAdd :29 axios ERROR', err)
        if (err.response.status === 401) {
          res.status(401).send({ 'code': 401, 'msg': err.response.statusText })
        } else if (err.response.status === 403) {
          res.status(403).send({ 'code': 401, 'msg': err.response.statusText })
        }
      })
    } else if (req.headers.sns === 'google') {
      await axios('https://www.googleapis.com/oauth2/v3/userinfo', {
        method: 'GET',
        headers: {
          'Authorization': access_token
        }
      }).then(async (googleData) => {
        let userInfo = await User.findOne({ 'email': googleData.data.email })

        if (!userInfo) {
          res.status(401).send('invalid token')
        } else {
          let allList = userInfo.list
          allList.push({ ...req.body, isChecked: false })

          User.updateOne({ 'email': googleData.data.email },
            {
              $set: { 'list': allList }
            }).then(res.status(200).send('추가되었습니다')).catch(err => {console.log(err),res.send('db 쓰기 오류')})
        }
      }).catch((err) => {
        console.log('Controller/PatchMypage :80 axios ERROR ', err)
        if (err.response.status === 401) {
          res.status(401).send({ 'code': 401, 'msg': err.response.statusText })
        } else if (err.response.status === 403) {
          res.status(403).send({ 'code': 401, 'msg': err.response.statusText })
        }
      })
    } else {
      res.status(401).send({ 'code': 401, 'msg': 'Unknown sns Token' })
    }
  } else {
    res.status(400).send({ 'code': 400, 'msg': 'not found token' })
  }
}

//req.body 에 유저 닉네임이랑, string이 옴
//배열속에 객체로 저장 nickname:req.body.nickname
// text:req.body.bucketname?
