import express from 'express'
import blog from '../controller/blog logic.js';
import verifyToken from '../middelewere/jwtPerser Secure.js';
import wrapperFunction from '../utils/asyncHandeller utils.js';

const { createBlog, readBlog, updateBlog } = blog
const { asyncHandeller } = wrapperFunction

const route = express.Router();

// route for create blog
route.post("/create", verifyToken, asyncHandeller(createBlog, "creating new blog"))

// route for read blog
route.post("/read", verifyToken, asyncHandeller(readBlog, "reading blog"))

// route for update blog
route.post("/update", verifyToken, asyncHandeller(updateBlog, "updating the blog"))

export default route;