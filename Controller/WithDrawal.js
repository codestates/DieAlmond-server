const axios = require("axios")
const User = require('../Database/Model/User')
const BucketList = require('../Database/Model/BucketList')
const allRemover = require('../middleware/AllRemover')
const likeRemover = require('../middleware/LikeRemover')

module.exports = async (req, res) => {
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
          console.log('userInfo',userInfo)
          
          if(!userInfo){
            res.status(401).send('invalid token')
          }else{
            allRemover(userInfo.list)
            let bucketList = await BucketList.find({})
            
            likeRemover(userInfo,bucketList)
            
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

// 회원 탈퇴 시 좋아요 모두 삭제.
// userinfo.likedlist[i].id 와 bucketlists[n] 이 같은걸 찾아서 remover에 집어넣음 처음부터 끝까지 반복문 돌리면 오래걸림
// bucketlist에 있는 요소들을 반으로 자름 bucketlist는 시간순으로 오름차순 정렬되어있음
// bucketlist를 반으로 자르고 왼쪽부터 확인. bucketlist의 가운데 숫자가 userinfo.likedlist[0]보다 작다면 userinfo.likedlist[0]은 오른쪽에 있음
// 왼쪽을 버리고 다시 오른쪽 요소들을 반으로 자르고 왼쪽 오른쪽으로 나눔 이를 반복함
// if middle.id = userinfo.likedList[i] 라면 retun middle

