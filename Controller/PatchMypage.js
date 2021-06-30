const axios = require('axios')
const User = require('../Database/model/User')


module.exports = async(req,res)=>{
    if(req.headers.authorization){
        let access_token = req.headers.authorization
        if(req.headers.sns === 'kakao'){
            await axios.get('https://kapi.kakao.com/v2/user/me',{  //카카오에 엑세스 토큰을 보내서 유저정보 요청
            headers:{
                'authorization':access_token
            }
        }).then(async(kakaoData) => {
            let userInfo = await User.findOne({'email':kakaoData.data.kakao_account.email})

            if(!userInfo){  // 회원 가입되어있는지 확인함.
                res.status(401).send('invalid token')
            }else{
                User.updateOne({'email':userInfo.email},
                {
                    $set:{'sleep':req.body.sleep},
                    $set:{'smoking':req.body.smoking},
                    $set:{'alcohol':req.body.alcohol},
                    $set:{'age':req.body.birth},
                    $set:{'gender':req.body.gender},
                    $set:{'nickname':req.body.nickname}
            }).then('업데이트 성공').catch(err => console.log(err))

            res.status(200).send('수정완료')
            }
        })
        }else if(req.headers.sns === 'google'){

        }
    }else{
        res.status(400).send('not found token')
    }
}