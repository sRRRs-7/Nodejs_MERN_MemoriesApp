import express from "express";
import { signUp, signIn } from "../controllers/user.js"


const router = express.Router();

//http://localhost:4000/user

router.post("/signup", signUp);
router.post("/signin", signIn);


export default router;