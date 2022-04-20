import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

import postRoutes from "./routes/posts.js";
import userRoutes from "./routes/users.js";


const app = express();
dotenv.config();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

const MONGO_URL = process.env.CONNECTION_URL;
const CONNECTION_URL = MONGO_URL;

app.use("/posts", postRoutes);
app.use("/user", userRoutes);

app.get("/", (req, res) => {
    res.send("APP IS RUNNING");
});

const PORT = process.env.PORT;

app.listen(PORT); // 4000

mongoose.connect(CONNECTION_URL)
    .then(() => { console.log("MONGO DB running") })
    .catch((error) => { console.log("error") });