const db = require("../config/db");
const {
    createPost,
    getPosts,
    getPostsByCategory,
    getPostsByUserId,
    getPostById,
    getCountPostById,
    editPost,
    deletePost,
    aprovePost,
    getTrendingPosts,
    getAllParentPost,
    getPostsByDoctor,
    getCountPostsByCategory,
    getCountParentPost,
} = require("../services/postServices");
const {
    getAllCommentInPost,
    deleteCommentOnPost,
} = require("../services/CommentServices");
const {
    deleteLikesByPost
} = require("../services/LikeServices")
const transformPost = (post) => {
    return {
        id: post.post_id,
        title: post.post_title,
        description: post.post_description,
        thumbnail: post.post_thumbnail,
        content: post.post_content,
        status: post.post_status,
        totalComment: post.post_comment,
        totalLikes: post.post_vote,
        totalPosts: post.total_post,
        createdAt: post.post_createdAt,
        updateAt: post.post_updatedAt,
        user: {
            id: post.user_id,
            username: post.user_fullName,
            role: post.user_role,
        },
        category: {
            id: post.category_id,
            name: post.category_name,
            description: post.category_description,
            path: post.category_path,
            createAt: post.category_createdAt,
            updateAt: post.category_updatedAt,
        },
    };
};
exports.getPosts = async (req, res, next) => {
    try {
        const data = await getPosts();
        let newdata = [];
        let categories = [...new Set(data.map((item) => item.category_id))];
        categories.forEach((category, i) => {
            let temp = {};
            let cats = [];
            temp.posts = [];
            data.forEach((d) => {
                if (d.category_id === category) {
                    temp.category_id = d.category_id;
                    temp.category_name = d.category_name;
                    temp.category_path = d.category_path;
                    cats.push(d);
                    temp.posts = cats.map(transformPost);
                    if (d.post_status === 1) {
                        temp.count = cats.length;
                    }
                }
            });
            newdata.push(temp);
        });
        res.send(newdata);
    } catch (error) {
        next(error);
    }
};
exports.getPostsByDoctor = async (req, res, next) => {
    try {
        const data = await getPostsByDoctor();
        let newdata = [];
        let categories = [...new Set(data.map((item) => item.category_id))];
        categories.forEach((category, i) => {
            let temp = {};
            let cats = [];
            temp.posts = [];
            data.forEach((d) => {
                if (d.category_id === category) {
                    temp.category_id = d.category_id;
                    temp.category_name = d.category_name;
                    temp.category_path = d.category_path;
                    cats.push(d);
                    temp.posts = cats.map(transformPost);
                    if (d.post_status === 1) {
                        temp.count = cats.length;
                    }
                }
            });
            newdata.push(temp);
        });
        res.send(newdata);
    } catch (error) {
        next(error);
    }
};
exports.appProve = async (req, res, next) => {
    try {
        const id = req.params.id;
        const result = await aprovePost(id);
        if (!result.affectedRows) {
            throw new Error("Cập nhập không thành công");
        }
        return res.status(200).json({ msg: "Cập nhập danh mục thành công" });
    } catch (error) {
        next(error);
    }
};
exports.getPostsByCategory = async (req, res, next) => {
    const { path } = req.params;
    const role = req.query.role;
    const pageAsNumber = Number.parseInt(req.query.page);
    const sizeAsNumber = Number.parseInt(req.query.size);
    let page = 0;
    if (!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
        page = pageAsNumber;
    }
    let size = 4;
    if (!Number.isNaN(sizeAsNumber) && sizeAsNumber > 0 && sizeAsNumber < 10) {
        size = sizeAsNumber;
    }
    try {
    
        const posts = await getPostsByCategory(path,role, size, page * size);
        const count = await getCountPostsByCategory(path,role);
        const total = count[0].total;
        // const count = posts2.length;
        res.json({
            content: posts.map(transformPost),
            totalPages: Math.ceil(total / Number.parseInt(size)),
        });
    } catch (error) {
        next(error);
    }
};
exports.getAllParentPosts = async (req, res, next) => {
    const pageAsNumber = Number.parseInt(req.query.page);
    const sizeAsNumber = Number.parseInt(req.query.size);
    let page = 0;
    if (!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
        page = pageAsNumber;
    }
    let size = 4;
    if (!Number.isNaN(sizeAsNumber) && sizeAsNumber > 0 && sizeAsNumber < 10) {
        size = sizeAsNumber;
    }
    try {
        const posts = await getAllParentPost(size, page * size);
        const count = await getCountParentPost();
        const total = count[0].total;
        res.json({
            content: posts.map(transformPost),
            totalPages: Math.ceil(total / Number.parseInt(size)),
        });
    } catch (error) {
        next(error);
    }
};

exports.createPost = async (req, res, next) => {
    const body = req.body;
    const userId = req.userId;
    const status = 0;
    try {
        const result = await createPost(body, userId, status);
        if (!result.affectedRows) {
            throw new Error("Thêm bài viết không thành công");
        }
        return res.status(200).json({ msg: "Thêm bài viết thành công" });
    } catch (error) {
        next(error);
    }
};
exports.getPostsByUserId = async (req, res, next) => {
    const { userId } = req.params;
    const status = req.query.status;
    if (status == 1) {
        isApprove = 1;
    }
    if (status == 0) {
        isApprove = 0;
    }

    const pageAsNumber = Number.parseInt(req.query.page);
    const sizeAsNumber = Number.parseInt(req.query.size);
    let page = 0;
    if (!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
        page = pageAsNumber;
    }
    let size = 4;
    if (!Number.isNaN(sizeAsNumber) && sizeAsNumber > 0 && sizeAsNumber < 10) {
        size = sizeAsNumber;
    }
    try {
        const posts = await getPostsByUserId(userId, status, size, page * size);
        const count = await getCountPostById(userId, isApprove);

        res.json({
            content: posts.map(transformPost),
            totalPages: Math.ceil(count.length / Number.parseInt(size)),
        });
    } catch (error) {
        next(error);
    }
};
exports.getPostById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const post = await getPostById(id);
        res.json(post);
    } catch (error) {
        next(error);
    }
};
exports.editPost = async (req, res, next) => {
    const body = req.body;
    const userId = req.userId;
    const blogId = req.params.id;
    try {
        const result = await editPost(body, userId, blogId);
        if (!result.affectedRows) {
            throw new Error("Cập nhập bài viết không thành công");
        }
        return res.status(200).json({ msg: "Cập nhập bài viết thành công" });
    } catch (error) {
        next(error);
    }
};
exports.deletePost = async (req, res, next) => {
    try {
        const id = req.params.id;
        await deleteLikesByPost(id);
        const data = await getAllCommentInPost(id);
        if (data) {
            await deleteCommentOnPost(id);
        }
        const result = await deletePost(id);
        if (!result.affectedRows) {
            throw new Error("Xoá bài viết thất bại");
        }
        return res.status(200).json({ msg: "Xóa  bài viết thành công" });
    } catch (error) {
        next(error);
    }
};
exports.getTrendingPosts = async (req, res, next) => {
    try {
        const data = await getTrendingPosts();
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};
