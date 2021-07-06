const BucketList = require('../Database/Model/BucketList')


module.exports = (list) => {  // 해당 유저의 모든 게시물 삭제
  for (let i in list) {
    BucketList.deleteOne({ 'id': list[i].id }).catch(err => console.log('AllRemover error', err))
  }
  return 1;
}