import mongoose from "mongoose";


const postSchema = mongoose.Schema({
    creator: String,
    title: String,
    name: String,
    message: String,
    tags: [String],
    selectedFile: String,
    likes: { type: [String], default: [] },
    comments: { type: [String], default: [] },
    created_at: { type: Date, default: new Date() },
});

const PostMessages = mongoose.model("PostMessage", postSchema);

export default PostMessages;