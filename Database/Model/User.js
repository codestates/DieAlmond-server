const mongoose = require('mongoose')
const { Schema } = mongoose;

const userSchema = new Schema(
    {
        id: { type: Number, required: false },
        email: { type: String, required: true },
        gender: { type: String, required: false },
        likedList: [Object], // 내가 좋아요 한 사람
        nickname: { type: String, required: false },
        list: [Object], // 개인 버킷리스트 인덱스 or 고유아이디가 들어감
        age: { type: Number, required: false },
        alcohol: { type: Number, required: false },
        smoking: { type: Number, required: false },
        sleep: { type: Number, required: false },
        contact: [String],
        condition: [Number], //{1월1일:좋음, 2월2일:보통}
        restLife: { type: Number, required: false },
        snsLogin: { type: String }  // 카카오로 가입했는지 페북으로 했는지 저장해둠
    }
);

const User = mongoose.model('User', userSchema);
module.exports = User;









