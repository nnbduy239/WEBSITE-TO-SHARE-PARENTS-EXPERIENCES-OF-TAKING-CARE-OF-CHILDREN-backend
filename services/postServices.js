const db = require("../config/db");
module.exports = {
    createPost: (data, id, isApprove) => {
        return new Promise((resolve, reject) => {
            db.query(
                "Insert into posts(title,thumbnail,description,categoryId,content,userId,createdAt,isApprove) values(?,?,?,?,?,?,?,?)",
                [
                    data.title,
                    data.thumbnail,
                    data.description,
                    data.categoryId,
                    data.content,
                    id,
                    data.createdAt,
                    isApprove,
                ],
                (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(results);
                }
            );
        });
    },
    editPost: (data, id, blogId) => {
        return new Promise((resolve, reject) => {
            db.query(
                "update posts set title= ?,thumbnail =?,description=?,categoryId=?,content=?,userId=?,updateAt=? where id =? ",
                [
                    data.title,
                    data.thumbnail,
                    data.description,
                    data.categoryId,
                    data.content,
                    id,
                    data.updateAt,
                    blogId,
                ],
                (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(results);
                }
            );
        });
    },
    aprovePost: (id) => {
        return new Promise((resolve, reject) => {
            db.query(
                "update posts set isApprove =1 where id = ?",
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
    deletePost: (id) => {
        return new Promise((resolve, reject) => {
            db.query("delete from posts where id = ?", [id], (err, results) => {
                if (err) {
                    return reject(err);
                }
                return resolve(results);
            });
        });
    },
    getPosts: () => {
        return new Promise((resolve, reject) => {
            db.query(
                ` SELECT p.id as post_id,
                p.title as post_title,
                p.thumbnail as post_thumbnail,
                p.description as post_description, 
                p.isApprove as post_status,
                p.content as post_content, 
                p.createdAt as post_createdAt,
                p.updateAt as post_updatedAt,
                u.id as user_id,
                u.fullName as user_fullName,
                u.role as user_role,
                u.createAt as user_createAt,
                u.updateAt as user_updateAt,
                c.id as category_id,
                c.name as category_name,
                c.path as category_path,
                c.description as category_description,
                c.createdAt as category_createdAt,
                c.updatedAt as category_updatedAt,
                (select count(*) from comment cm where cm.postId = p.id) as post_comment,
                (select count(*) from vote v where v.postId = p.id) as post_vote
                FROM posts p
                      JOIN user u on p.userId = u.id
                      JOIN category c on p.categoryId = c.id
                      GROUP BY p.id 
                      order by p.createdAt DESC
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
    getPostsByDoctor: () => {
        return new Promise((resolve, reject) => {
            db.query(
                ` SELECT p.id as post_id,
                p.title as post_title,
                p.thumbnail as post_thumbnail,
                p.description as post_description, 
                p.isApprove as post_status,
                p.content as post_content, 
                p.createdAt as post_createdAt,
                p.updateAt as post_updatedAt,
                u.id as user_id,
                u.fullName as user_fullName,
                u.role as user_role,
                u.createAt as user_createAt,
                u.updateAt as user_updateAt,
                c.id as category_id,
                c.name as category_name,
                c.path as category_path,
                c.description as category_description,
                c.createdAt as category_createdAt,
                c.updatedAt as category_updatedAt,
                (select count(*) from comment cm where cm.postId = p.id) as post_comment,
                (select count(*) from vote v where v.postId = p.id) as post_vote
                FROM posts p
                      JOIN user u on p.userId = u.id
                      JOIN category c on p.categoryId = c.id
                      where p.isApprove = 1 and u.role ='doctor'
                      GROUP BY p.id 
                      order by p.createdAt DESC
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
    getPostsByCategory: (path, role, limit, offset) => {
        return new Promise((resolve, reject) => {
            db.query(
                ` SELECT p.id as post_id,
                p.title as post_title,
                p.thumbnail as post_thumbnail,
                p.description as post_description, 
                p.isApprove as post_status,
                p.content as post_content, 
                p.createdAt as post_createdAt,
                p.updateAt as post_updatedAt,
                u.id as user_id,
                u.fullName as user_fullName,
                u.createAt as user_createAt,
                u.updateAt as user_updateAt,
                c.id as category_id,
                c.name as category_name,
                c.path as category_path,
                c.description as category_description,
                c.createdAt as category_createdAt,
                c.updatedAt as category_updatedAt,
                (select count(*) from comment cm where cm.postId = p.id) as post_comment,
                (select count(*) from vote v where v.postId = p.id) as post_vote
                FROM posts p
                       JOIN user u on p.userId = u.id
                      JOIN category c on p.categoryId = c.id
                      WHERE c.path =? and p.isApprove =1 and u.role =?
                      group by p.id 
                      order by p.createdAt DESC
                      limit ${limit} offset ${offset}
                     `,
                [path, role, limit, offset],
                (err, results, fields) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(results);
                }
            );
        });
    },
    getCountPostsByCategory: (path,role) => {
        return new Promise((resolve, reject) => {
            db.query(
                ` select count(*) as total 
                from posts p  
                join user u on p.userId = u.id
                 join category c on p.categoryId = c.id 
                 where c.path = ? 
                 and u.role =? and p.isApprove ='1' 
                 order by p.id 

                     `,
                [path,role],
                (err, results, fields) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(results);
                }
            );
        });
    },

    getAllParentPost: (limit, offset) => {
        return new Promise((resolve, reject) => {
            db.query(
                ` SELECT p.id as post_id,
                p.title as post_title,
                p.thumbnail as post_thumbnail,
                p.description as post_description, 
                p.isApprove as post_status,
                p.content as post_content, 
                p.createdAt as post_createdAt,
                p.updateAt as post_updatedAt,
                u.id as user_id,
                u.fullName as user_fullName,
                u.createAt as user_createAt,
                u.updateAt as user_updateAt,
                c.id as category_id,
                c.name as category_name,
                c.path as category_path,
                c.description as category_description,
                c.createdAt as category_createdAt,
                c.updatedAt as category_updatedAt,
                (select count(*) from comment cm where cm.postId = p.id) as post_comment,
                (select count(*) from vote v where v.postId = p.id) as post_vote
                FROM posts p
                       JOIN user u on p.userId = u.id
                      JOIN category c on p.categoryId = c.id
                      WHERE u.role = 'parent' and p.isApprove =1
                      group by p.id
                      order by p.createdAt DESC
                      limit ${limit} offset ${offset}
                     `,
                [limit, offset],
                (err, results, fields) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(results);
                }
            );
        });
    },
    getCountParentPost: () => {
        return new Promise((resolve, reject) => {
            db.query(
                ` select count(*) as total 
                from posts p  
                join user u on p.userId = u.id
                 where u.role ='parent' and p.isApprove ='1'
                 order by p.id `,
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
    getCountPostById: (userId, isApprove) => {
        return new Promise((resolve, reject) => {
            db.query(
                ` SELECT id from posts WHERE userId =? and isApprove =?`,
                [userId, isApprove],
                (err, results, fields) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(results);
                }
            );
        });
    },
    getPostsByUserId: (userId, status, limit, offset) => {
        return new Promise((resolve, reject) => {
            db.query(
                ` SELECT p.id as post_id,
                p.title as post_title,
                p.thumbnail as post_thumbnail,
                p.description as post_description, 
                p.isApprove as post_status,
                p.content as post_content, 
                p.createdAt as post_createdAt,
                p.updateAt as post_updatedAt,
                u.id as user_id,
                u.fullName as user_fullName,
                u.createAt as user_createAt,
                u.updateAt as user_updateAt,
                c.id as category_id,
                c.name as category_name,
                c.path as category_path,
                c.description as category_description,
                c.createdAt as category_createdAt,
                c.updatedAt as category_updatedAt,
                (select count(*) from comment cm where cm.postId = p.id) as post_comment,
                (select count(*) from vote v where v.postId = p.id) as post_vote
                FROM posts p
                       JOIN user u on p.userId = u.id
                      JOIN category c on p.categoryId = c.id
                      WHERE p.userId = ? and p.isApprove =? 
                      group by p.id
                      order by p.createdAt DESC
                      limit ${limit} offset ${offset}
                     `,
                [userId, status, limit, offset],
                (err, results, fields) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(results);
                }
            );
        });
    },
    getPostById: (id) => {
        return new Promise((resolve, reject) => {
            db.query(
                ` SELECT p.id as post_id,
                p.title as title,
                p.thumbnail as thumbnail,
                p.description as description,
                p.content as content, 
                p.isApprove as post_status,
                p.createdAt as createdAt,
                p.updateAt as post_updatedAt,
                u.id as userId,
                u.fullName as user_fullName,
                c.id as category,
                (select count(*) from comment cm where cm.postId = p.id) as post_comment,
                (select count(*) from vote v where v.postId = p.id) as post_vote
                FROM posts p
                      JOIN user u on p.userId = u.id
                      JOIN category c on p.categoryId = c.id
                      WHERE p.id = ?
                      group by p.id
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
    getAllPostByUserId: (userId) => {
        return new Promise((resolve, reject) => {
            db.query(
                "Select * from posts where userId =?",
                [userId],
                (err, results, fields) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(results);
                }
            );
        });
    },
    getTrendingPosts: () => {
        return new Promise((resolve, reject) => {
            db.query(
                ` SELECT p.id as post_id,
                p.title as post_title,
                p.thumbnail as post_thumbnail,
                p.description as post_description, 
                p.isApprove as post_status,
                p.content as post_content, 
                p.createdAt as post_createdAt,
                p.updateAt as post_updatedAt,
                u.id as user_id,
                u.fullName as user_fullName,
                u.createAt as user_createAt,
                u.updateAt as user_updateAt,
                (select count(*) from comment cm where cm.postId = p.id) as post_comment,
                (select count(*) from vote v where v.postId = p.id) as post_vote,
                (select count(*) from posts p where p.userId = u.id) as total_post
                FROM posts p
                JOIN user u on p.userId = u.id
                      where  p.isApprove =1
                      order by post_vote DESC
                      limit 10
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
    deletePostByUserId: (id) => {
        return new Promise((resolve, reject) => {
            db.query(
                "delete from posts where userId = ?",
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
