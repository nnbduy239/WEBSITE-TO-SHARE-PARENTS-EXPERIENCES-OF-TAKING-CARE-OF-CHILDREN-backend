const db = require("../config/db");
module.exports = {
  createCategory: (data,path) => {
    return new Promise((resolve, reject) => {
      db.query(
        "insert into category(name,description,path,createdAt,updatedAt) values(?,?,?,NoW(),NOW())",
        [data.name, data.description,path],
        (err, results) => {
          if (err) {
            return reject(err);
          }
          return resolve(results);
        }
      );
    });
  },
  getCategories: () => {
    return new Promise((resolve, reject) => {
      db.query(
        "select id,name,description,path,createdAt,updatedAt from category",
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
  getCategoryById: (id) => {
    return new Promise((resolve, reject) => {
      db.query(
        "select name,description from category where id = ?",
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
  getCategoryByName: (name) => {
    return new Promise((resolve, reject) => {
      db.query(
        "select * from category where name = ?",
        [name],
        (err, results, fields) => {
          if (err) {
            return reject(err);
          }
          return resolve(results);
        }
      );
    });
  },
  getCategoryByPath: (path) => {
    return new Promise((resolve, reject) => {
      db.query(
        "select * from category where path = ?",
        [path],
        (err, results, fields) => {
          if (err) {
            return reject(err);
          }
          return resolve(results);
        }
      );
    });
  },
  updateCategory: (id, data) => {
    return new Promise((resolve, reject) => {
      db.query(
        "update category set name = ?, description =?,updatedAt = NOW() where id = ?",
        [data.name, data.description, id],
        (err, results) => {
          if (err) {
            return reject(err);
          }
          return resolve(results);
        }
      );
    });
  },
  deleteCategory:(id) =>{
    return new Promise((resolve, reject) => {
      db.query(
        "delete from category where id = ?",
        [id],
        (err, results) => {
          if (err) {
            return reject(err);
          }
          return resolve(results);
        }
      );
    });
  }
};
