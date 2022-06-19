const db = require("../config/db");

module.exports = {
  sendNotification: (entityId, type, message, notifier_id, createdAt) => {
    return new Promise((resolve, reject) => {
      db.query(
        "insert into notification(entityId,type,message,notifier_id,createdAt) values(?,?,?,?,NOW())",
        [entityId, type, message, notifier_id, createdAt],
        (err, results) => {
          if (err) {
            return reject(err);
          }
          return resolve(results);
        }
      );
    });
  },
  getAllNotification: (userId,readed) => {
    return new Promise((resolve, reject) => {
      db.query(
        ` Select * from notification where notifier_id = ? and readed =? order by createdAt DESC
                   `,
        [userId,readed],
        (err, results, fields) => {
          if (err) {
            return reject(err);
          }
          return resolve(results);
        }
      );
    });
  },
  readNotification: (id) => {
    return new Promise((resolve, reject) => {
      db.query(
        ` Update notification set readed = 1 where id = ?
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
  deleteNotification: (id) => {
    return new Promise((resolve, reject) => {
        db.query("delete from notification where id = ?", [id], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
},
};