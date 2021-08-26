module.exports = (list,id) => {
  let allList = list
  for (let i in allList) {   // 받아온 id 값을 기준으로 users.list 배열에서 삭제
    if (allList[i].id === id) {
      delete allList[i]
      break;  // id값은 중복될 수 없음 불필요한 연산 제거
    }
  }
  allList = allList.filter((item) => {  //배열의 요소를 지우면 그자리에 empty값이 생김 혹시모를 해당 값 제외한 필터링
    return 'empty' !== item || 'undefined' !== item
  })
  return allList
}

// list 는 1차원 배열에 객체가 들어있는 형태 그 속에.id가 있어야함