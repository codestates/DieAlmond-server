const axios = require('axios')
const User = require('../Database/model/User')
//ya29.a0ARrdaM-9LJzD0veBAijIOvXg9uzhs75i_LMmpkVwpRTIqUU_9AdzWrdFS3CpT1BZWIfzhjPUgZAt011TwoHu9usYQCvRw9OSr6klA-iO32T507VOgMvKDuHYajY0ZRGyOCQpVpQ9z8n-atjdts3mpH_tvrcOvg
module.exports = async (req, res) => {
  if (req.headers.authorization) {
    let access_token = req.headers.authorization
    if (req.headers.sns === 'kakao') {  ////////////////////////////////////////////////////////////////kakao
      await axios.get('https://kapi.kakao.com/v2/user/me', {  //카카오에 엑세스 토큰을 보내서 유저정보 요청
        headers: {
          'authorization': access_token
        }
      }).then(async (kakaoData) => {
        let userInfo = await User.findOne({ 'email': kakaoData.data.kakao_account.email })

        if (!userInfo) {  // 회원 가입되어있는지 확인함.
          res.status(401).send('invalid token')
        } else {
          let valid = await User.findOne({'nickname': req.body.nickname})

          if(!valid){
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
            }).then(res.status(200).send('수정완료')).catch(err => console.log("Controller/PatchMypage :28 DB update ERROR",err))  //DB 쓰기 성공 or 실패
          }else{                   
            res.status(409).send({'code':409,'msg':'Duplicate Nickname'})
          }
        }
      }).catch((err) => {
        console.log("Controller/PatchMypage :34 axios ERROR",err)
        res.status(401).send('Expired Token')
      })  //axios error
    } else if (req.headers.sns === 'google') {   ///////////////////////////////////////////////////// google
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
            let valid = await User.findOne({'nickname': req.body.nickname})  //닉네임 중복체크

            if(valid.email = userInfo.email){  //나의 닉네임도 검색되는 문제
              valid = null
            }

            if(!valid){
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
              }).then(res.status(200).send('수정완료')).catch((err) => 
              {
                console.log('Controller/PatchMypage : 68 /DB update ERROR',err)
                res.send({'code':404,'msg':'Please try again in a few minutes.'})
              })    // db 업데이트 에러
            }else{
              res.status(409).send({'code':409,'msg':'Duplicate Nickname'})
            }
          }
        }).catch((err) => {
          console.log('Controller/PatchMypage :77 axios ERROR ',err)
          if(err.response.status === 401){
            res.status(401).send({'code':401,'msg':err.response.statusText})
          }else if(err.response.status === 403){
            res.status(403).send({'code':401,'msg':err.response.statusText})
          }
        })
    }else{
      res.status(400).send({'code':401,'msg':'Unknown sns Token'})  // 
    }
  } else {   // not found token    
    res.status(400).send({'code':400,'msg':'not found token'})  //
  }
}