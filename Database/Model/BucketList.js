const mongoose = require('mongoose')
const { Schema } = mongoose;


const bucketSchema = new Schema(
    {
        id:{type:Number, required:false},
        like:[Object], // 이 게시물을 좋아요한 사람(user 고유아이디)
        author:{type:String, required:true},  //user 에 nickname 값.
        content:{type:String, require:true}
    }  
)

const BucketList = mongoose.model('BucketList', bucketSchema);
module.exports = BucketList;

