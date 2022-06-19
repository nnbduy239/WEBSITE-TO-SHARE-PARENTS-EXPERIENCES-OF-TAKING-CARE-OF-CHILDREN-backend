const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../config/sendMail");
const {
    activeEmail,
    getUserbyEmail,
    changePassword,
} = require("../services/userServices");
exports.Register = async (req, res) => {
    const { fullName, email, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const userRole = "parent";
    const avatar =
        "https://res.cloudinary.com/dcmfr2ldt/image/upload/v1652629267/forum/cyn4idact1lpulwmwvku.png";
    const activeToken = jwt.sign(
        { fullName, hashPassword, email, userRole },
        process.env.ACTIVE_TOKEN_SECRET,
        {
            expiresIn: "30m",
        }
    );
    const url = `http://localhost:3000/active/${activeToken}`;
    db.query("SELECT * FROM user WHERE email = ?", [email], (err, result) => {
        if (err) throw err;
        if (result.length != 0) {
            res.status(409).send({ msg: "Người dùng đã tồn tại" });
        } else {
            db.query(
                "INSERT INTO user (fullName, email, password,role,avatar,createAT,updateAt) VALUES (?, ?,?,?,?, NOW(), NOW())",
                [fullName, email, hashPassword, userRole, avatar],
                (err, result) => {
                    if (err) throw err;
                    else {
                        sendEmail(email, url, "Xác minh email");
                        res.status(200).send({
                            msg: "Đăng ký thành công! Kiểm tra email để xác minh tài khoản",
                        });
                    }
                }
            );
        }
    });
};

exports.activeAccount = async (req, res, next) => {
    try {
        const { activeToken } = req.body;
        const decode = jwt.verify(
            activeToken,
            `${process.env.ACTIVE_TOKEN_SECRET}`
        );
        const user = await getUserbyEmail(decode.email);
        if (user[0].isActive === 1) {
            throw new Error("người dùng đã kích hoạt tài khoản");
        }
        await activeEmail(decode.email);
        res.json({ msg: "kich hoạt tài khoản thành công" });
    } catch (error) {
        next(error);
    }
};
exports.sendEmailForgotPassword = async (req, res, next) => {
    const email = req.body.email;
    try {
        const user = await getUserbyEmail(email);
        if (user.length === 0) {
            res.status(404).json({ msg: "email chưa đăng ký tài khoản" });
        } else {
            const fullName = user[0].fullName;
            const password = user[0].password;
            const email = user[0].email;
            const userRole = user[0].role;
            const activeToken = jwt.sign(
                { fullName, password, email, userRole },
                process.env.ACTIVE_TOKEN_SECRET,
                {
                    expiresIn: "30m",
                }
            );
            const url = `http://localhost:3000/forgot-password/${activeToken}`;
            await sendEmail(email, url, "Lấy lại mật khẩu");
            res.status(200).json({
                msg: "Thành công! vui lòng kiểm tra email",
            });
        }
    } catch (error) {}
};
exports.ChangePassword = async (req, res, next) => {
    const { password, repassword, activeToken } = req.body;
    if (password != repassword) {
        return res.status(400).send({
            msg: "Mật khẩu không khớp",
        });
    }

    try {
        const hashPassword = await bcrypt.hash(password, 10);
        const decode = jwt.verify(
            activeToken,
            `${process.env.ACTIVE_TOKEN_SECRET}`
        );
        await changePassword(hashPassword, decode.email);
        res.status(200).send({ msg: "Đổi mật khẩu thành công" });
    } catch (error) {
        next(error);
    }
};
exports.Login = (req, res) => {
    db.query(
        "SELECT * FROM user WHERE email = ?",
        req.body.email,
        async (err, user) => {
            if (err) throw err;
            if (user.length == 0) {
                res.status(400).json({ msg: "Email không tồn tại" });
            } else {
                if (user[0].isActive === 0) {
                    res.status(400).json({
                        msg: "Tài khoản chưa được kích hoạt vui lòng kiểm tra email",
                    });
                }
                if (user[0].isBanned === 1) {
                    res.status(400).json({
                        msg: "Tài khoản của bạn bị khóa vĩnh viễn do vi phạm điều khoản của diễn đàn",
                    });
                } else {
                    const hashedPassword = user[0].password;
                    const match = await bcrypt.compare(
                        req.body.password,
                        hashedPassword
                    );
                    if (!match)
                        return res.status(400).json({ msg: "Sai mật khẩu" });
                    const userId = user[0].id;
                    const userName = user[0].fullName;
                    const email = user[0].email;
                    const role = user[0].role;
                    const acessToken = jwt.sign(
                        { userId, userName, email, role },
                        process.env.ACCESS_TOKEN_SECRET,
                        { expiresIn: "30m" }
                    );
                    const refreshToken = jwt.sign(
                        { userId, userName, email, role },
                        process.env.REFRESH_TOKEN_SECRET,
                        {
                            expiresIn: "2h",
                        }
                    );
                    db.query(
                        "UPDATE user SET refreshToken =? where Id =?",
                        [refreshToken, userId],
                        (err, result) => {
                            if (err) throw err;
                            res.cookie("refreshToken", refreshToken, {
                                httpOnly: true,
                                maxAge: 24 * 60 * 60 * 1000,
                                // maxAge: 1000 * 3600 * 24 * 30,
                            });
                            res.json({ user, acessToken });
                        }
                    );
                }
            }
        }
    );
};
exports.Logout = (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(204);
    db.query(
        "SELECT * FROM user WHERE refreshToken = ?",
        refreshToken,
        (err, user) => {
            if (err) {
                throw err;
            }
            if (!user[0]) {
                res.status(204);
            } else {
                const userID = user[0].id;
                db.query(
                    "UPDATE user SET refreshToken =? where Id =?",
                    [null, userID],
                    (err, result) => {
                        if (err) throw err;
                        else {
                            // res.clearCookie("refreshToken", { httpOnly: true });
                            res.clearCookie("refreshToken", {
                                httpOnly: true,
                                sameSite: "None",
                                secure: true,
                            });

                            return res.sendStatus(200);
                        }
                    }
                );
            }
        }
    );
};
