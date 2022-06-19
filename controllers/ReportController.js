const db = require("../config/db");
const {
    createReport,
    getReports,
    getReportByCommentId,
    DeleteReportById,
    getReportByPostId,
} = require("../services/ReportServices");
exports.getReports = async (req, res, next) => {
    try {
        const data = await getReports();
        res.status(200).send(data);
    } catch (error) {
        next(error);
    }
};
exports.createReport = async (req, res, next) => {
    const body = req.body;
    const userId = req.userId;
    try {
        if (!userId) return;
        const report = await getReportByCommentId(body.commentId,userId);
        if (report.length === 0) {
            await createReport(body, userId);
            return res.status(200).json({
                msg: "Cảm ơn bạn. Chúng tôi đã nhận được báo cáo của bạn. Nếu chúng tôi thấy nội dung này vi phạm Nguyên tắc cộng đồng của chúng tôi, chúng tôi sẽ xóa nội dung đó.",
            });
        } else {
            res.send({ msg: "Bạn đã báo cáo bình luận" });
        }
    } catch (error) {
       next(error)
    }
};
exports.createPostReport = async (req, res, next) => {
    const body = req.body;
    const userId = req.userId;
    try {
        if (!userId) return;
        const report = await getReportByPostId(body.postId,userId);
        if (report.length === 0) {
            await createReport(body, userId);
            return res.status(200).json({
                msg: "Cảm ơn bạn. Chúng tôi đã nhận được báo cáo của bạn. Nếu chúng tôi thấy nội dung này vi phạm Nguyên tắc cộng đồng của chúng tôi, chúng tôi sẽ xóa nội dung đó.",
            });
        } else {
            res.send({ msg: "Bạn đã báo cáo bài viết" });
        }
    } catch (error) {
        next(error)
    }
};
exports.deleteReportById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const result = await DeleteReportById(id);
        if (!result.affectedRows) {
            throw new Error("Xóa không thành công");
        }
        return res.sendStatus(200);
    } catch (error) {
        next(error);
    }
};
