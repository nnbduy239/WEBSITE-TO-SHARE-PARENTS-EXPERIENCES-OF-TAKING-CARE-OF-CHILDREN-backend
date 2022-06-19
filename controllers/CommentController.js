const db = require("../config/db");

const {
  createComment,
  getAllCommentInPost,
  getComments,
  getCommentById,
  deleteCommentById,
  UpdateCommentById,
  deleteCommentRoot
} = require("../services/CommentServices");
const {DeleteReportByCommentId}  = require("../services/ReportServices");
const transformComment = (comment) => {
  return {
    id: comment.comment_id,
    content: comment.comment_content,
    postId: comment.comment_postId,
    userId: comment.comment_userId,
    commentRoot: comment.comment_root,
    replyUser: comment.comment_reply,
    createdAt: comment.comment_createdAt,
    updatedAt: comment.comment_updatedAt,
    user: {
      id: comment.user_id,
      username: comment.user_fullName,
      createAt: comment.user_createdAt,
      avatar: comment.user_avatar,
      updateAt: comment.user_updatedAt,
    },
  };
};
exports.addComment = async (req, res, next) => {
  const { content, commentRoot, replyUser } = req.body;
  const postId = req.params.id;
  const userId = req.userId;
  try {
    const result = await createComment(
      postId,
      userId,
      content,
      commentRoot,
      replyUser
    );
 
    if (!result.affectedRows) {
      throw new Error("Lỗi");
    }
    const comment = await getCommentById(result.insertId);
    return res.status(200).send(comment.map(transformComment));
  } catch (error) {
    next(error);
  }
};
exports.getCommentOnPost = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const data = await getAllCommentInPost(postId);
  
    res.send(data.map(transformComment));
  } catch (error) {
    next(error);
  }
};
exports.getComments = async (req, res, next) => {
  try {
    const data = await getComments();
    res.send(data.map(transformComment));
  } catch (error) {
    next(error);
  }
};
exports.deleteComment = async (req, res, next) => {
  try {
    const id = req.params.id;
    await DeleteReportByCommentId(id);
    const result = await deleteCommentById(id);
    await deleteCommentRoot(id);
    if (!result.affectedRows) {
      throw new Error("Xóa không thành công");
    }
    return res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};
exports.updateComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    const id = req.params.id;
    const result = await UpdateCommentById(content, id);
    if (!result.affectedRows) {
      throw new Error("Cập nhập thất bại");
    }
   return res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};
