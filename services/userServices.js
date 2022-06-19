const db = require("../config/db");
module.exports = {
    createUser: (data, password, avatar) => {
        return new Promise((resolve, reject) => {
            db.query(
                "insert into user(fullName,email,password,avatar,role,gender,isActive,createAt) values(?,?,?,?,?,?,1,NOW())",
                [
                    data.fullName,
                    data.email,
                    password,
                    avatar,
                    data.role,
                    data.gender,
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
    countUser: () => {
        return new Promise((resolve, reject) => {
            db.query(
                "select count(*) as count from user",
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
    getUsers: () => {
        return new Promise((resolve, reject) => {
            db.query(
                "SELECT *,(select count(*)  from posts p where p.userId = u.id  ) as total_post FROM user u",
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
    getUserbyId: (id) => {
        return new Promise((resolve, reject) => {
            db.query(
                "select * from user where id = ?",
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
    getCurrentUser: (id) => {
        return new Promise((resolve, reject) => {
            db.query(
                "select * from user where id = ?",
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
    getUserbyEmail: (email) => {
        return new Promise((resolve, reject) => {
            db.query(
                "select * from user where email = ?",
                [email],
                (err, results, fields) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(results);
                }
            );
        });
    },
    updateUser: (id, data) => {
        return new Promise((resolve, reject) => {
            db.query(
                "update user set fullName = ?,password=?, email =?,avatar=?,gender =?,role=?,updateAt = NOW() where id = ?",
                [
                    data.fullName,
                    data.password,
                    data.email,
                    data.avatar,
                    data.gender,
                    data.role,
                    id,
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
    updateProfile: (id, data) => {
        return new Promise((resolve, reject) => {
            db.query(
                "Update user set fullName =?,gender =?,phoneNumber =?,avatar =? where id =? ",
                [data.fullName, data.gender, data.phoneNumber, data.avatar, id],
                (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(results);
                }
            );
        });
    },
    deleteUser: (id) => {
        return new Promise((resolve, reject) => {
            db.query(
                "update user set isBanned = 1 where id = ?",
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
    activeEmail: (email) => {
        return new Promise((resolve, reject) => {
            db.query(
                "Update user set isActive =1  where email =? ",
                [email],
                (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(results);
                }
            );
        });
    },
    changePassword: (password, email) => {
        return new Promise((resolve, reject) => {
            db.query(
                "Update user set password =?  where email =? ",
                [password, email],
                (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(results);
                }
            );
        });
    },
    deleteRefreshToken: (id) => {
        return new Promise((resolve, reject) => {
            db.query(
                "update user set refreshToken = NULL where id = ?",
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
