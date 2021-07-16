// userinfo가 들어있으면 userinfo에서 업데이트 타겟이 user임 
// userinfo 가 들어있지 않으면 업데이트 타겟이 User임
// userinfo 는 oprtion 파라미터로 받음
module.exports = async (req,model,key,value,option) => {
  if(!option){
    await model.updateOne({'id': req.body.bucketid },
    {
      $set:{[key]:value}
    })
  }else{
    await model.updateOne({'email':option.email},
        {
          $set:{[key]:value}
        })
  }
}


