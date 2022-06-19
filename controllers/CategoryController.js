const db = require("../config/db");
const  jsrmvi = require('jsrmvi');
const { removeVI } = jsrmvi;
const {
  createCategory,
  getCategoryByName,
  getCategoryByPath,
  getCategories,
  deleteCategory,
  updateCategory,
} = require("../services/CategoryServices");

(exports.createCategory = async (req, res, next) => {
  try {
    const body = req.body;
    const path = removeVI(req.body.name)
    const category = await getCategoryByName(body.name);
    if (category.length) {
      return res.status(409).send({ msg: "Danh mục đã tồn tại" });
    }
    const result = await createCategory(body,path);
    if (!result.affectedRows) {
      throw new Error("Thêm danh mục thất bại");
    }
    return res.status(200).json({ msg: "Thêm danh mục thành công"});
  } catch (err) {
    next(err);
  }
}),
  (exports.getCategories = async (req, res, next) => {
    try {
      const categories = await getCategories();
      return res.json({
        categories,
      });
    } catch (error) {
      next(error);
    }
  });
exports.getCategoryByPath = async(req,res,next) =>{
  const path  = req.params.path
  try {
    const categories = await getCategoryByPath(path);
    return res.json({
      categories,
    });
  } catch (error) {
    next(error);
  }
}
exports.updateCategory = async (req, res, next) => {
  try {
    const id = req.params.id;
    const body = req.body;
    const result = await updateCategory(id, body);
    if (!result.affectedRows) {
      throw new Error("Cập nhập không thành công");
    }
    return res.status(200).json({ msg: "Cập nhập danh mục thành công" });
  } catch (error) {
    next(error);
  }
};
exports.deleteCategory = async(req,res,next) =>{
  try {
    const id = req.params.id;
    const result = await deleteCategory(id);
    if (!result.affectedRows) {
      throw new Error("Xoá danh mục thất bại");
    }
    return res.status(200).json({ msg: "Xóa danh mục thành công" });
  } catch (error) {
    next(error);
  }
}
