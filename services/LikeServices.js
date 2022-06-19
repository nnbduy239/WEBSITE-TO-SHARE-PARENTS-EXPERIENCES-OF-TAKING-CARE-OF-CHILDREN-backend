const db = require("../config/db");
module.exports = {
  createLike: (
    postId,
    userId,
  ) => {
    return new Promise((resolve, reject) => {
      db.query(
        "insert into vote(postId,userId) values(?,?)",
        [postId, userId],
        (err, results) => {
          if (err) {
            return reject(err);
          }
          return resolve(results);
        }
      );
    });
  },
  getLikes: (
    postId,userId
  ) => {
    return new Promise((resolve, reject) => {
      db.query(
        "Select * from vote where postId = ? and userId =?",
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
  deleteLikes: (
    postId,
    userId
  ) => {
    return new Promise((resolve, reject) => {
      db.query(
        "delete from vote where postId = ? and userId =?",
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
  deleteLikesByUser: (
    userId
  ) => {
    return new Promise((resolve, reject) => {
      db.query(
        "delete from vote where userId =?",
        [userId],
        (err, results) => {
          if (err) {
            return reject(err);
          }
          return resolve(results);
        }
      );
    });
  },
  deleteLikesByPost: (
    postId
  ) => {
    return new Promise((resolve, reject) => {
      db.query(
        "delete from vote where postId =?",
        [postId],
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