import mongoose from "mongoose";
import PostMessages from "../models/postMessage.js";


export const getPosts = async(req, res) => {
    const { page } = req.query;

    try {
        const LIMIT = 9;
        const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page
        const total = await PostMessages.countDocuments({});

        const posts = await PostMessages.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);

        res.status(200).json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT) });

    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};


export const getPost = async(req, res) => {
    const { id } = req.query;

    try {
        const post = await PostMessages.findById(id);

        res.status(200).json(post);

    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};


export const getPostsBySearch = async(req, res) => {
    const { searchQuery, tags } = req.query;

    try {
        const title = new RegExp(searchQuery, "i"); // Test, test, TEST -> test
        const posts = await PostMessages.find({ $or: [{ title }, { tags: { $in: tags.split(",") } }] }); // $or -> either title or tags , $in -> tags match
        res.status(200).json({ data: posts });

    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};


export const createPost = async(req, res) => {
    const post = req.body;
    const newPost = new PostMessages({...post, creator: req.userId, created_at: new Date().toISOString() });

    try {
        await newPost.save();
        res.status(201).json(newPost);

    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};


export const updatePost = async(req, res) => {
    const post = req.body;
    const { id: _id } = req.params;
    const updatedPost = await PostMessages.findByIdAndUpdate(_id, {...post, _id }, { new: true });

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send("No post with that id")
    }
    res.json(updatedPost);
};


export const deletePost = async(req, res) => {
    const { id: _id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send("No post with that id");
    };
    await PostMessages.findByIdAndDelete(_id);
    res.json({ message: "Post deleted successfully" });
};


export const likePost = async(req, res) => {
    const { id } = req.params;
    const post = await PostMessages.findById(id);
    const index = post.likes.findIndex((id) => id === String(req.userId));

    if (!req.userId) {
        return res.json({ message: "Unauthenticated" });
    };

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send("No post with that id");
    };

    if (index === -1) {
        post.likes.push(req.userId);
    } else {
        post.likes = post.likes.filter((id) => id !== String(req.userId));
    };

    const updatedPost = await PostMessages.findByIdAndUpdate(id, post, { new: true });

    res.json(updatedPost);
};


export const commentPost = async(req, res) => {
    const { id } = req.params;
    const { value } = req.body;
    const post = await PostMessages.findById(id);

    post.comments.push(value);

    const updatedPost = await PostMessages.findByIdAndUpdate(id, post, { new: true });

    res.json(updatedPost);
}