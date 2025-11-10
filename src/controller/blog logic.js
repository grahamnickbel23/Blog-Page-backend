import logger from "../logger/log logger.js";
import blogSchema from "../models/blogSchema.js";

export default class blog {

    // create blogs
    static async createBlog(req, res) {

        // get the info first
        const data = req.body;
        const { userId } = req.token;
        data.writter = userId;

        // save what ever junk you got
        const newBlog = blogSchema(data);
        await newBlog.save();

        // create a log
        logger.info(`${req.requestId} ${req.sessionId} created a new blog`);

        // return a ok response
        return res.status(200).json({
            success: true,
            message: `new blog added successfully`
        })
    }

    // get the read api
    static async readBlog(req, res) {

        // get the info dirst
        const { blogId } = req.body || req.params;

        // cheak i that blog exisit
        const doesBlogExisit = await blogSchema.findById(blogId);

        // if not send error
        if (!doesBlogExisit) {
            return res.status(404).json({
                success: false,
                messafe: `error finding the blog you requested`
            })
        }

        // if all ok send the blog all in
        return res.status(200).json({
            success: true,
            message: doesBlogExisit
        })
    }

    // get an update api
    static async updateBlog(req, res) {

        // get the incoming info
        const { blogId, field, info } = req.body;

        if (!field || info === undefined) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: field, or info"
            });
        }

        // due to nested updates using dynamic field path
        const updateObj = {};
        updateObj[field] = info;

        // update doc
        await blogSchema.findByIdAndUpdate(
            blogId,
            { $set: updateObj },
            { new: true }
        )

        // log update
        logger.info(`${req.requestId} ${req.sessionId} updated field "${field}" for blog ${blogId}`);

        return res.status(200).json({
            success: true,
            message: `Blog field "${field}" updated successfully`,
        });
    }
}