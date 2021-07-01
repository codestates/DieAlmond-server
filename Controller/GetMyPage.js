const axios = require('axios')
const User = require('../Database/model/User')

module.exports = async (req, res) => {
  if (req.headers.authorization) {
    let access_token = req.headers.authorization

    if (req.headers.sns === 'google') {   // 어디서 만들어진 토큰인지 몰라서 클라이언트 측에서 알려줌
      await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          'Authorization': access_token
        }
      }).then(async (googleData) => {  // 요청 후 받은 데이터에서 email 꺼내옴 => db에서 조회
          let userInfo = await User.findOne({ 'email': googleData.data.email })//findOne 하는 이유 불필요한 검색 줄임, 이미 같은 아이디는 가입불가하도록 만들어둠
          if (!userInfo) {  // 토큰이 유효하지 않다면
            res.status(401).send({'code':401,'msg':'invalid token'})
          } else {  // 유효하다면
            res.status(200).send({ 'userinfo': userInfo, 'msg': 'success' })
          }
        }).catch((err) => {
					console.log('axios ERROR',err)
					if(err.response.status === 401){
            res.status(401).send({code:401,msg:err.response.statusText})
					}else if(err.response.status === 403){
						res.status(403).send({code:403,msg:err.response.statusText})
					}
					
				})
    }else if (req.headers.sns === 'kakao') {
      await axios.get('https://kapi.kakao.com/v2/user/me', {
        headers: {
          'authorization': access_token
        }
      }).then(async (kakaoData) => {
        let userInfo = await User.findOne({ 'email': kakaoData.data.kakao_account.email })
        if (!userInfo) { // 유효하지 않은 토큰 이라면
          res.status(401).send({'code':-401,'msg':'invalid token'})
        } else {  // 유효한 토큰이라면
          res.status(200).send({ 'userinfo': userInfo, 'msg': 'success' })
        }
      })
    }
  } else {   //헤더에 토큰이 없다면
    res.status(400).send('not found token')
  }
}