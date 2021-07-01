const axios = require('axios')
const User = require('../Database/model/User')

module.exports = async (req, res) => {
  if (req.headers.authorization) {
    let access_token = req.headers.authorization
    if (req.headers.sns === 'kakao') {
      await axios.get('https://kapi.kakao.com/v2/user/me', {  //카카오에 엑세스 토큰을 보내서 유저정보 요청
        headers: {
          'authorization': access_token
        }
      }).then(async (kakaoData) => {
        let userInfo = await User.findOne({ 'email': kakaoData.data.kakao_account.email })

        if (!userInfo) {  // 회원 가입되어있는지 확인함.
          res.status(401).send('invalid token')
        } else {
          User.updateMany({ 'email': userInfo.email },  // save()는 모든 필드 덮어쓰기라서 기존에 있던 내용 사라짐
            {
              $set: {
                'sleep': req.body.sleep,
                'smoking': req.body.smoking,
                'alcohol': req.body.alcohol,
                'age': req.body.birth,
                'gender': req.body.gender,
                'nickname': req.body.nickname
              }
            }).then('업데이트 성공').catch(err => console.log(err))
          //DB 쓰기 성공 or 실패

          res.status(200).send('수정완료')
        }
      }).catch(err => console.log(err, "axios ERROR"))  //axios error
    } else if (req.headers.sns === 'google') {
      await axios('https://www.googleapis.com/oauth2/v3/userinfo',
        {
          method: 'GET',
          headers: {
            'Authorization': access_token
          }
        }).then(async (googleData) => {
          let userInfo = await User.findOne({ 'email': googleData.data.email })  // db에서 조회

          if (!userInfo) {
            res.status(401).send('invalid token')
          } else {
            User.updateOne({ 'email': userInfo.email },  // 파라미터로 받은 데이터 db에서 수정
              {
                $set: {
                  'sleep': req.body.sleep,
                  'smoking': req.body.smoking,
                  'alcohol': req.body.alcohol,
                  'age': req.body.birth,
                  'gender': req.body.gender,
                  'nickname': req.body.nickname
                }
              }).then('업데이트 성공').catch(err => console.log(err))

            res.status(200).send('수정완료')
          }
        })
    }
  } else {   // not found token    
    res.status(400).send('not found token')  //
  }
}