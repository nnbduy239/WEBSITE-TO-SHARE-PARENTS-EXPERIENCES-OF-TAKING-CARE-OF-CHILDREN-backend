const db = require("../config/db");
const {getAllNotification,readNotification,deleteNotification} =  require("../services/NotificationServices");

exports.getNotification = async (req, res, next) => {
  const userId = req.params.userId;
  const readed = req.query.readed
  try {
    const data = await getAllNotification(userId,readed);
    res.status(200).json(data)
  } catch (error) {
    next(error);
  }
};
  exports.readNotification = async (req, res, next) => {
    const id = req.body.id
    try {
       await readNotification(id);
      res.sendStatus(200)
    } catch (error) {
      next(error);
    }
  }
  exports.deleteNotification = async (req, res, next) => {
    try {
        const id = req.params.id;
        await deleteNotification(id);
        return res.sendStatus(200);
    } catch (error) {
        next(error);
    }
};
