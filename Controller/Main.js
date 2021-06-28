module.exports = (req,res)=>{
    const User = require('../Database/model/User')
    
    let UserModel = new User();
    UserModel.id = 1,
    UserModel.likefromuser = [1,4,5,3,6]
    UserModel.nickname = 'kim',
    UserModel.list = ['헬스','레이싱'],
    UserModel.age = 24,
    UserModel.alcohol = 0,
    UserModel.smoke = 0,
    UserModel.sleep = 5,
    UserModel.contact = ['엄마','아빠','동생'],
    UserModel.dead = 60,
    UserModel.snsLogin = 'google'
    
    UserModel.save().then(res.send('get Main success'))
.catch(err => console.log(err))
}

