const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mysql = require("mysql");
const AppErrors = require("./utils/AppErrors");
const { createComment } = require("./services/CommentServices");
const { sendNotification } = require("./services/NotificationServices");
require("dotenv").config();
const app = express();
const port = process.env.port || 5000;

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept",
        "Set-Cookie: cross-site-cookie=whatever; SameSite=None; Secure"
    );
    next();
});
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(cookieParser());
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);
//http server
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
    cors: {
        origin: "*",
    },
});
let users = [];
let onlineUser = [];
const addUser = (userId, socketId) => {
    !onlineUser.some((user) => user.userId === userId) &&
        onlineUser.push({ userId, socketId });
};
const removeUser = (socketId) => {
    onlineUser = onlineUser.filter((user) => user.socketId !== socketId);
};
const getUser = (userId) => {
    return onlineUser.find((user) => user.userId === userId);
};
io.on("connection", (socket) => {
    socket.on("joinRoom", (id) => {
        const user = { userId: socket.id, room: id };
        const check = users.every((user) => user.userId !== socket.id);
        if (check) {
            users.push(user);
            socket.join(user.room);
        } else {
            users.map((user) => {
                if (user.userId === socket.id) {
                    if (user.room !== id) {
                        socket.leave(user.room);
                        socket.join(id);
                        user.room = id;
                    }
                }
            }); 
        }
    });
    socket.on("create_comment", async (data) => {
        // const {postId,userId,content,commentRoot,replyUser} = data;
        await createComment(
            data.postId,
            data.userId,
            data.body,
            data.rootComment,
            data.replyUser
        );
        await io.to(data.postId).emit("sendCommentToClient", data);
    });
    socket.on("newUser", (userId) => {
        addUser(userId, socket.id);
    });
    socket.on(
        "sendNotification",
        async ({ entityId, type, message, notifierId }) => {
            await sendNotification(entityId, type, message, notifierId);
            const receiver = getUser(notifierId);

            if (receiver) {
                io.to(receiver.socketId).emit("getNotification", {
                    entityId,
                    type,
                    message,
                    notifierId,
                });
            } else {
                io.to(notifierId).emit("getNotification", {
                    entityId,
                    type,
                    message,
                    notifierId,
                });
            }
        }
    );
    socket.on("disconect", () => {
        removeUser(socket.id);
    });
});

app.use("./uploads", express.static("uploads"));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/user", require("./routes/user"));
app.use("/api/p", require("./routes/posts"));
app.use("/api", require("./routes/comment"));
app.use("/api/category", require("./routes/category"));
app.use("/api/likes", require("./routes/Likes"));
app.use("/api/reports", require("./routes/report"));
app.use("/api/notification", require("./routes/Notification"));
app.all("*", (req, res, next) => {
    throw new AppErrors(` not found!`, 404);
});

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: 0,
        message: err.message,
    });
});

http.listen(port, () => {
    console.log(`listening on port ${port}`);
});
