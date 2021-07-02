const xlsx = require('node-xlsx')
const fs = require('fs')
const obj = xlsx.parse(__dirname + '/lifedata.xlsx')  // 엑셀 데이터 읽어옴.
// 혹시 ec2에서 작동 안된다면 obj에 복붙해서 직접 넣기

module.exports = (gender, age) => {
  
  //obj 인덱스 0,1에는 설명이 들어있음 age + 2 해서 데이터 보내주면됨. 
  //남자 obj[0].data[age+2][1]
  //여자 obj[0].data[age+2][2]
  
  //  obj[0].data[age+2][0] = 기대여명 전체
  //  obj[0].data[age+2][1] = 남자 기대여명
  //  obj[0].data[age+2][2] = 여자 기대 여명 
  if(gender === 'male'){
    return obj[0].data[age+2][1]
  }else if(gender === 'female'){
    return obj[0].data[age+2][2]
  }
}