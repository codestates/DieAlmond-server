
const axios = require('axios')
const User = require('../../Database/model/User')

module.exports = async (req,res)=>{
    if(req.headers.Authorization){
        let access_token = req.headers.Authorization
        await axios(`https://kapi.kakao.com/v2/user/me`,{  //클라이언트에서 소셜인증을 완료하고 엑세스 토큰을 보내줌 해당 토큰으로 카카오에 다시요청
            method:'GET',
            headers:{
                Authorization: `Bearer ${access_token}` // 클라이언트에서 보내준 엑세스토큰
            }
        }).then(res => {
            console.log(res)
            const [email, name] = res
            let userInfo = User.findOne({email:res.email})  // db에서 가입된 이메일 인지 확인

            if(userInfo){  // 가입된 아이디라면 무언가 값이 들어있음
                if(userInfo.snsLogin === undefined){
                    res.send('로그인 완료')
                }else{
                    res.send(`이미 ${userInfo.snsLogin} 소셜 회원으로 가입된 이메일 입니다.`)
                }
            }else{  // 가입된 아이디가 아니라면 undefined 혹은 nan이 뜰것임
                let UserModel = new User();  //모델 생성
                UserModel.email = email  //모델에 데이터 추가
                UserModel.nickname = name  //추후에 변경가능함 
                
                UserModel.save()   // db에 유저정보 저장
                .then(console.log('save!'))
                .catch(err=>console.log('save Error',err))

                res.send('완료')
            }
        })  //받아온 개인정보 ex) email, name 등등
    }else{
        
    res.status(401).send('can not find Access Token from headers')
    }
}
// 카카오에 엑세스토큰으로 요청을 보내고 유저 정보를 받아옴 
// 받아온 유저 정보에서 email 만 뽑아와서 db를 조회함 -> 중복유저 방지 
// if 같은 유저가 있다면 snsLogin 키를 참조해서 kakao로 가입된 아이디인지 facebook으로 가입된아이디 인지 응답보냄
// 가입된 email이 없다면 db에 해당 유저의 정보를 저장함.

