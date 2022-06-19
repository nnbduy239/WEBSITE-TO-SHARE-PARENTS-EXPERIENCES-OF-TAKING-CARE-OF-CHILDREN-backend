const db = require("../config/db");

module.exports = {
  createComment: (postId, userId, content,commentRoot , replyUser , createdAt) => {
    return new Promise((resolve, reject) => {
      db.query(
        "insert into comment(postId,userId,content,commentRoot,replyUser,createdAt,updatedAt) values(?,?,?,?,?,NOW(),NOW())",
        [postId, userId, content, commentRoot,replyUser, createdAt],
        (err, results) => {
          if (err) {
            return reject(err);
          }
          return resolve(results);
        }
      );
    });
  },
  getAllCommentInPost: (postId) => {
    return new Promise((resolve, reject) => {
      db.query(
        ` SELECT cm.id as comment_id,
              cm.content as comment_content,
              cm.postId as comment_postId,
              cm.userId as comment_userId,
              cm.commentRoot as comment_root,
              cm.replyUser as comment_reply,
              cm.createdAt as comment_createdAt,
              cm.updatedAt as comment_updatedAt,   
              u.id as user_id,
              u.avatar as user_avatar,
              u.fullName as user_fullName
              FROM comment cm
                    JOIN user u on cm.userId = u.id
                    where cm.postId =?
                    GROUP BY cm.id 
                   `,
        [postId],
        (err, results, fields) => {
          if (err) {
            return reject(err);
          }
          return resolve(results);
        }
      );
    });
  },
  //   updateComment: (postId, userId, content, replyUser) => {
  //   return new Promise((resolve, reject) => {
  //     db.query(
  //       "update comment set content =? where id =?",
  //       [postId, userId, content, replyUser],
  //       (err, results) => {
  //         if (err) {
  //           return reject(err);
  //         }
  //         return resolve(results);
  //       }
  //     );
  //   });
  // },
  getComments:() =>{
    return new Promise((resolve, reject) => {
      db.query(
        ` SELECT cm.id as comment_id,
              cm.content as comment_content,
              cm.postId as comment_postId,
              cm.userId as comment_userId,
              cm.commentRoot as comment_root,
              cm.replyUser as comment_reply,
              cm.createdAt as comment_createdAt,
              cm.updatedAt as comment_updatedAt,   
              u.id as user_id,
              u.avatar as user_avatar,
              u.fullName as user_fullName
              FROM comment cm
                    JOIN user u on cm.userId = u.id
                    GROUP BY cm.id 
                    order by cm.createdAt DESC
                   `,
        [],
        (err, results, fields) => {
          if (err) {
            return reject(err);
          }
          return resolve(results);
        }
      );
    });
  },
  getCommentById:(id) =>{
    return new Promise((resolve, reject) => {
      db.query(
        ` SELECT cm.id as comment_id,
              cm.content as comment_content,
              cm.postId as comment_postId,
              cm.userId as comment_userId,
              cm.commentRoot as comment_root,
              cm.replyUser as comment_reply,
              cm.createdAt as comment_createdAt,
              cm.updatedAt as comment_updatedAt,   
              u.id as user_id,
              u.avatar as user_avatar,
              u.fullName as user_fullName
              FROM comment cm
                    JOIN user u on cm.userId = u.id
                    Where cm.id =?
                    GROUP BY cm.id 
                    order by cm.createdAt DESC
                   `,
        [id],
        (err, results, fields) => {
          if (err) {
            return reject(err);
          }
          return resolve(results);
        }
      );
    });
  },
  deleteCommentById:(id) =>{
    return new Promise((resolve, reject) => {
      db.query(
        "delete from comment where id =?",
        [id],
        (err, results, fields) => {
          if (err) {
            return reject(err);
          }
          return resolve(results);
        }
      );
    });
  },
  UpdateCommentById:(content,id) =>{
    return new Promise((resolve, reject) => {
      db.query(
        "Update comment set content =?  where id =?",
        [content,id],
        (err, results, fields) => {
          if (err) {
            return reject(err);
          }
          return resolve(results);
        }
      );
    });
  },
  deleteCommentOnPost:(postId) =>{
    return new Promise((resolve, reject) => {
      db.query(
        "delete from comment where postId =?",
        [postId],
        (err, results, fields) => {
          if (err) {
            return reject(err);
          }
          return resolve(results);
        }
      );
    });
  },
  deleteCommentRoot:(commentRoot) =>{
    return new Promise((resolve, reject) => {
      db.query(
        "delete from comment where commentRoot=?",
        [commentRoot],
        (err, results, fields) => {
          if (err) {
            return reject(err);
          }
          return resolve(results);
        }
      );
    });
  },
};

