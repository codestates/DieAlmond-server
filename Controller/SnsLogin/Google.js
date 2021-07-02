const axios = require('axios')
const User = require('../../Database/model/User')
const jwt = require('jsonwebtoken')

module.exports = async (req,res)=>{
    let access_token = req.headers.authorization  //클라이언트가 보내준 엑세스 토큰

    if(access_token === undefined){
        res.status(400).send('not found token')
    }

    await axios(`https://www.googleapis.com/oauth2/v3/userinfo`,  //클라이언트 에서 받은 토큰으로 구글 api 요청 => 유저정보 가져옴
    {
        method:'GET',
        headers:{
            'Authorization':access_token
        }
    }).then(async (googleData) => {  
        let userInfo =await User.findOne({'email':googleData.data.email}) //받아온 구글 데이터에서 email만 뽑아와 db를 조회한다.
        if(!userInfo){ //db에 없는 email 이라면 즉 소셜 로그인을 한 적이 없다면(회원이 아니라면)
            let userModel = new User();
            userModel.email = googleData.data.email  //구글에서 받아온 이메일
            // userModel.nickname = googleData.data.given_name
            userModel.snsLogin = 'google'
            userModel.save()
            .then(res.send({
                'access_token':access_token,
                msg:'sign up & sign in success'
            }))
            .catch(err => {
                console.log('DB ERROR',err)
                res.send('error 다시 시도해주세요')
            })
        }else{ //db에 이미 존재하는 이메일임
            if(userInfo.snsLogin !== 'google'){  // 구글 회원이 맞는가? 다른 소셜 회원이라면 해당 하는 소셜로그인으로 다시 로그인 하라고 알림.
                res.status(401).send(`해당 이메일은 이미 ${userInfo.snsLogin} 계정으로 가입되어 있습니다. ${userInfo.snsLogin} 으로 로그인 해주세요`)
            }else{
                res.status(200).send({'access_token':access_token,'msg':'login success'})
            }
        }
    }).catch((err)=>{  //err handle
        console.log('Controller/SnsLogin/Google.js/ axios ERROR',err)
        if(err.response.status === 401){
            res.status(401).send({code:401,'msg':err.response.statusText}) //Unauthorized  
        }else if(err.response.status === 403){
            res.status(403).send({code:403,'msg':err.response.statusText})
        }
    })
}

// 클라이언트에서 받아온 토큰을 구글api로 다시 보내서 해독해야 하는데 오류남 //Request failed with status code 400