let User = require('../Database/Model/User')
let BucketList = require('../Database/Model/BucketList')
const remover = require('../middleware/UserDataRemover')  // 배열의 특정 요소삭제 1차원배열에 id라는 key를 가진 객체가 들어있는 구조 여야함
// [{id:짱구},{id:철수}]  여기서 id는 닉네임

module.exports = (userinfo,bucketlist) => {
  
  for(let i in userinfo.likedList){   
    removeLikedBucket(bucketlist,userinfo.likedList[i],userinfo)  // for문으로 하면 비효율적이라 재귀로함
  }    
  return
}
async function removeLikedBucket(bucketlist,target,userinfo) { // db처리 해야해서 async
  let middle = Math.round(bucketlist.length / 2)   // bucketlist의 모든 리스트를 반으로 자름
  let left = bucketlist.slice(0, middle)  // middle 값을 기준으로 왼쪽 모든 요소
  let right = bucketlist.slice(middle, bucketlist.length) // middle 값을 기준으로 오른쪽 모든 요소
  
  if (bucketlist[middle].id === Number(target.id)) {  // target.id가 string형식으로 들어가있음 일단 임시로 Number로 바꿈
    let like = remover(bucketlist[middle].like,userinfo.nickname)  // remover는 커스텀 함수; target.id를 bucketlist에서 찾았다면 해당 리스트에서 userinfo.nickname 요소만 삭제 후 정렬
    await BucketList.updateOne({'id':bucketlist[middle].id},  
    {
      $set:{'like':like}  // Bucketlist에서 목표 게시물을 id기준으로 찾는다 (유저 정보에 게시물 id가 들어가 있기 때문)
    })  // 그 후 like를 조금전에 변경한 값으로 바꿈  
    return
  }
  if (bucketlist[middle].id > Number(target.id)) {  // bucketlist는 시간순으로 오름차순 정렬되어있다. target 값과 비교해서 왼쪽에 있을지 오른쪽에 있을지 확인
    removeLikedBucket(left,target,userinfo)  // target 값이 bucketlist의 중간 값보다 작다면, middle 기준으로 left에 있음 left를 다시 넣어서 재귀돌림
  } else if (bucketlist[middle].id < Number(target.id)) {
    removeLikedBucket(right,target,userinfo)  // 위와 반대 
  }
}

// removeLikedBucket 함수를 8번줄 for문으로 반복함

