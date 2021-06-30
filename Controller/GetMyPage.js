const User = require('../Database/model/User')

module.exports = (req,res)=>{
    if(req.headers.Authorization){
        // 구글에 보내서 해독 한 후 정보
    }
    res.send('Get Mypage')
}