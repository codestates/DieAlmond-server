
const axios = require('axios')
const User = require('../../Database/model/User')

module.exports = async (req,res)=>{
    if(req.headers.authorization){  // 헤더에 토큰이 있다면.
        let access_token = req.headers.authorization  
        await axios.get('https://kapi.kakao.com/v2/user/me',{  //카카오에 엑세스 토큰을 보내서 유저정보 요청
            headers:{
                'authorization':access_token
            }
        }).then( async (kakaoData) => {
            let userInfo = await User.findOne({'email':kakaoData.data.kakao_account.email})
            
            if(!userInfo){ // 등록되지 않은 이메일 이라면 생성한 모델로 db 에 입력
                let userModel = new User();
                userModel.email = kakaoData.data.kakao_account.email;
                userModel.gender = kakaoData.data.kakao_account.gender
                userModel.snsLogin = 'kakao'
                userModel.nickname = kakaoData.data.kakao_account.profile.nickname;
                
                userModel.save()
                .then(res.send({
                    'access_token':access_token,
                    msg:'success signup & signin'
                }))
                .catch(err => {   // mongoDB error catch
                    console.log('DB ERROR',err)
                    res.send('error 다시 시도해주세요')
                })
            }else{
                if(userInfo.snsLogin !== 'kakao'){ // 회원으로 가입되어 있지만 kakao 로 가입된건 아님. 해당 소셜로그인으로 유도
                    res.status(401).send(`해당 이메일은 이미 ${userInfo.snsLogin} 계정으로 가입되어 있습니다. ${userInfo.snsLogin} 계정으로 로그인 해주세요`)
                }else{
                    res.status(200).send({'access_token':access_token,msg:'success sign in'})
                }
            }
        })
        .catch(err => console.log('axios error',err))  //axios error catch
    }
}
        // 
        // await axios(`https://kapi.kakao.com/v2/user/me`,{  //클라이언트에서 소셜인증을 완료하고 엑세스 토큰을 보내줌 해당 토큰으로 카카오에 다시요청
        //     method:'GET',
        //     headers:{
        //         'Authorization': access_token // 클라이언트에서 보내준 엑세스토큰
        //     }
        // }).then(kakaoData => res.send(kakaoData))
    
// 카카오에 엑세스토큰으로 요청을 보내고 유저 정보를 받아옴 
// 받아온 유저 정보에서 email 만 뽑아와서 db를 조회함 -> 중복유저 방지 
// if 같은 유저가 있다면 snsLogin 키를 참조해서 kakao로 가입된 아이디인지 facebook으로 가입된아이디 인지 응답보냄
// 가입된 email이 없다면 db에 해당 유저의 정보를 저장함.
