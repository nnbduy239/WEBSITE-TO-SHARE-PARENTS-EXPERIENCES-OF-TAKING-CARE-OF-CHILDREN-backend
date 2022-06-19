exports.validationRegister = (req,res,next) =>{
  const {email,password,confPassword} = req.body;
  if(password!=confPassword){
    return res.status(400).send({
      msg: 'Mật khẩu không khớp'
    });
  }
  if(!req.body.email){
    return res.status(400).send({
      msg: 'Email không được để trống'
    });
  }
  if (!req.body.password || req.body.password.length < 8) {
    return res.status(400).send({
      msg: 'Mật khẩu tối thiểu 8 ký tự'
    });
 }
 next();
}