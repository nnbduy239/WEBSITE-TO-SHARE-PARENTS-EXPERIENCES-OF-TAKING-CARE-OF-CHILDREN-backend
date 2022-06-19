const jwt = require('jsonwebtoken');

exports.verifyToken = (req,res,next)=>{
  const token = req.headers.authorization.split(' ')[1];
  if(token == null) return res.sendStatus(401);
  try {
    const decoded =  jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
    req.email = decoded.email;
    req.userId = decoded.userId;
    req.role  =decoded.role;
    next();
  } catch (error) {
    return res.status(403).json(error);
  }
}
exports.isAdmin = (req,res,next) =>{
      if(req.role =="admin"){
        next();
        return;
      }
      res.status(403).send({
        msg:'require admin'
      })
      return;
}
exports.isOwner = (req,res,next) =>{
  if(req.userId == req.param.id){
    next();
    return;
  }
  res.status(403).send({
    msg:'require owner'
  })
  return;
}