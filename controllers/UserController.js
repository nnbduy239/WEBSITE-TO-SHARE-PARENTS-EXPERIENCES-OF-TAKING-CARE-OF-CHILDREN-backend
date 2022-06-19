const db = require("../config/db");
const bcrypt = require("bcrypt");
const {
  createUser,
  getUserbyId,
  getUserbyEmail,
  countUser,
  updateUser,
  deleteUser,
  getUsers,
  getCurrentUser
} = require("../services/userServices");
const  {getAllPostByUserId,deletePost} = require("../services/postServices")
const  {deleteCommentOnPost,deleteCommentByUserId,deleteCommentRoot} = require("../services/CommentServices")
const {deleteLikesByUser,deleteLikesByPost}= require("../services/LikeServices")
exports.getUsers =async (req, res,next) => {
 try {
   const users = await getUsers()
   return res.json({users})
 } catch (error) {
   next(error)
 }
};
exports.countUser =async (req, res,next) => {
  try {
    const count = await countUser();
    res.status(200).json({count})
  } catch (error) {
    next(error)
  }
 };
exports.getUserbyId = async (req, res,next) => {
  const id = req.params.id;
  try {
    const user = await getUserbyId(id)
    return res.json({user})
  } catch (error) {
    next(error)
  }
};
exports.getCurrentUser = async (req, res,next) => {
  const id = req.userId;
  try {
    const user = await getCurrentUser(id)
    return res.json({user})
  } catch (error) {
    next(error)
  }
};
exports.createUser = async (req,res,next) => {
  try {
    const body = req.body;
    const password = req.body.password;
    const hashPassword = await bcrypt.hash(password, 10);
    const avatar ="https://res.cloudinary.com/dcmfr2ldt/image/upload/v1652629267/forum/cyn4idact1lpulwmwvku.png"
    const user = await getUserbyEmail(body.email);
    if (user.length) {
      return res.status(409).send({ msg: "Người dùng đã tồn tại" });
    }
    const result = await createUser(body,hashPassword,avatar);
    if (!result.affectedRows) {
      throw new Error("Thêm người dùng thất bại");
    }
    return res.status(200).json({ msg: "Thêm người dùng thành công" });
  } catch (err) {
    next(err);
  }
}
exports.updateUser = async (req, res,next) => {
  const userId = req.params.id;
  const body = req.body;
  try {
    const result = await updateUser(userId,body);
    if (!result.affectedRows) {
      throw new Error("Cập nhập không thành công");
    }
    return res.status(200).json({ msg: "Cập nhập người dùng thành công" });
  } catch (error) {
    next(error);
  }
  
};
exports.updateProfile = async (req, res) => {
  const userId = req.userId;
  const { fullName, gender, phoneNumber, avatar, dateOfBirth } = req.body;
  try {
    db.query(
      "Update user set fullName =?,gender =?,phoneNumber =?,avatar =?,dateOfBirth=? where id =? ",
      [fullName, gender, phoneNumber, avatar, dateOfBirth, userId]
    );
    return res.status(200);
  } catch (error) {
    throw error;
  }
};
exports.deleteUser = async(req,res,next) =>{
  try {
    const id = req.params.id;
    await deleteUser(id);
    return res.status(200).json({ msg: "Khóa người dùng thành công" });
  } catch (error) {
    next(error);
  }
}

