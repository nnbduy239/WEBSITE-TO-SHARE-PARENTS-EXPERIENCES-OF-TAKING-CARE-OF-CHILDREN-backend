const db = require("../config/db");
module.exports = {
    createReport: (data, userId) => {
        return new Promise((resolve, reject) => {
            db.query(
                "insert into reports(commentId,postId,context,userId,createdAt) values(?,?,?,?,NOW())",
                [data.commentId,data.postId,data.context, userId],
                (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(results);
                }
            );
        });
    },
    getReports: () => {
        return new Promise((resolve, reject) => {
            db.query(
                ` SELECT
                rp.id as report_id,
                rp.context as report_context,
                rp.createdAt as report_createdAt, 
                 cm.id as comment_id,
              cm.content as comment_content,
              cm.postId as comment_postId,
              cm.userId as comment_userId,
              cm.commentRoot as comment_root,
              cm.createdAt as comment_createdAt,
              (select u.fullName from user u where cm.userId = u.id) as createBy, 
              p.id as post_id,
              p.title as post_title,
              p.userId as post_userId,
              (select u.fullName from user u where p.userId = u.id) as author,
              u.id as user_id
              FROM reports rp
                 left JOIN posts p on rp.postId = p.id
                 left JOIN comment cm on rp.commentId  = cm.id 
                    JOIN user u on rp.userId = u.id
                    GROUP BY rp.id 
                    order by rp.createdAt DESC
                   `,
                [],
                (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(results);
                }
            );
        });
    },      
    getReportByCommentId: (commentId,userId) => {
        return new Promise((resolve, reject) => {
            db.query(
                ` SELECT * from reports where commentId =? and userId =?
                   `,
                [commentId,userId],
                (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(results);
                }
            );
        });
    },
    getReportByPostId: (postId,userId) => {
        return new Promise((resolve, reject) => {
            db.query(
                ` SELECT * from reports where postId =? and userId =?
                   `,
                [postId,userId],
                (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(results);
                }
            );
        });
    },
    DeleteReportById: (id) => {
        return new Promise((resolve, reject) => {
            db.query(
                ` delete from reports where id =?
                   `,
                [id],
                (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(results);
                }
            );
        });
    },
    DeleteReportByCommentId: (id) => {
        return new Promise((resolve, reject) => {
            db.query(
                ` delete from reports where commentId =?
                   `,
                [id],
                (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(results);
                }
            );
        });
    },
};
