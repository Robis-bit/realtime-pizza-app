function guest(req,res,next){
  if(!req.isAuthenticated()){
      return next()
  }
  return res.redriect('/')
}

module.exports=guest