const jwt = require("jsonwebtoken");
const db = require("../config/db");
const {
 deleteRefreshToken
} = require("../services/userServices");
exports.refreshToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    res.status(401);
  } else {
    db.query(
      "SELECT * from user where refreshToken = ?",
      refreshToken,
      (err, user) => {
        if (err) {
          throw err;
        }
        if (user.length == 0) {
          res.clearCookie("refreshToken", {
            httpOnly: true,
            sameSite: "None",
            secure: true,
        });
          return res.status(403);
        } else {
          jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, decode) => {
              if (err) {
                 deleteRefreshToken(user[0].id)
              } else {
                const userId = user[0].id;
                const userName = user[0].fullName;
                const email = user[0].email;
                const role = user[0].role;
                const acessToken = jwt.sign(
                  { userId, userName, email, role },
                  process.env.ACCESS_TOKEN_SECRET,
                  { expiresIn: "30m" }
                );
                res.status(200).json({ acessToken, user });
              }
            }
          );
        }
      }
    );
  }
};
