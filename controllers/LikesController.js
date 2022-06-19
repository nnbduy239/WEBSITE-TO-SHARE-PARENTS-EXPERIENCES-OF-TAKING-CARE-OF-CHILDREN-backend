const db = require("../config/db");
const {createLike,getLikes,deleteLikes} = require("../services/LikeServices");
exports.addLikes = async (req, res, next) => {
 const {postId} = req.body;
  const userId = req.userId;
  try {
   const likes = await getLikes(postId,userId)
   if(likes.length ===0){
     await createLike(postId,userId);
   }
    else{
      await deleteLikes(postId,userId);
    }
    return res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};
