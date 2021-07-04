const life = require('../life/life')
const axios = require('axios')
const User = require('../Database/model/User')

// { year : 1999, month: 2, day: 17, gender : male, sleep : 8, smoking : 10, alcohol : 2}
module.exports = async (req, res) => {
  const gender = req.body.gender
  const age = req.body.age
  const data = life(gender,age).toString()  //  life는 나이대별 기대여명을 리턴해주는 함수

  if (req.headers.authorization) {  //*회원* 이라면 db에 쓰고 회원 아니면 걍 데이터만 보내줌
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
          let valid = await User.findOne({ 'nickname': req.body.nickname })  //닉네임 중복체크
          
          if(valid){
            if(valid.email === userInfo.email){  //초기 닉네임 중복체크 내 닉네임은 중복으로 치지않고 그냥 업데이트함
              valid = null
            }
          }
          
          if (!valid) {
            User.updateMany({'email': userInfo.email },
            {
              $set: {
                'sleep': req.body.sleep,
                'smoking': req.body.smoking,
                'alcohol': req.body.alcohol,
                'gender': req.body.gender,
                'age': req.body.age,
                'nickname': req.body.nickname
              }
            }).then(res.status(200).send({ 'life': data, 'msg': 'success' }))
            .catch((err) => { 
              console.log('Controller/Setting db ERROR', err) 
            })  
          }else{
            res.status(409).send({'code':409,'msg':'Duplicate Nickname'})
          }
        }
      }).catch((err) => {
          console.log('Controller/Setting axios ERROR', err)
          if (err.response.status === 401) {
            res.status(401).send({ 'code': 401, 'msg': err.response.statusText })
          } else if (err.response.status === 403) {
            res.status(403).send({ 'code': 401, 'msg': err.response.statusText })
          }
        })
    } else if(req.headers.sns === 'google'){
      await axios('https://www.googleapis.com/oauth2/v3/userinfo',
      {
        method:'GET',
        headers:{
          'Authorization':access_token
        }
      }).then(async (googleData)=>{
        let userInfo = await User.findOne({'email':googleData.data.email})
        
        if(!userInfo){
          res.status(401).send('invalid token')
        }else{
          let valid = await User.findOne({ 'nickname': req.body.nickname })

          if (!valid) {
            User.updateMany({'email': userInfo.email },
            {
              $set: {
                'sleep': req.body.sleep,
                'smoking': req.body.smoking,
                'alcohol': req.body.alcohol,
                'gender': req.body.gender,
                'age': req.body.age,
                'nickname': req.body.nickname
              }
            }).then(res.status(200).send({ 'life': data, 'msg': 'success' }))
            .catch((err) => { 
              console.log('Controller/Setting db ERROR', err) 
            })  
          }else{
            res.status(409).send({'code':409,'msg':'Duplicate Nickname'})
          }
        }
      }).catch(err => console.log(err))
    }
  }else {// *비회원* 토큰 없어도 기대여명은 보내줌
    res.status(200).send({ 'life': data, 'msg': 'success' })
  }// 비회원도 받을 순 있음.
}

// 로직 
// 시작버튼 누르고 들어온 비회원유저도 파라미터는 받는다 그 후 서버에서 토큰 검사를함
// 헤더에 토큰이 없다면 비회원으로 간주하고 기대 여명만 보내줌
// 헤더에 토큰이 있다면 회원으로 간주하고 토큰 해독 후 해당 유저의 정보에 입력 그 후 데이터 보냄