import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({

    title: String,

    perpous:{
        type: String,
        enum:['project', 'blog'],
        default: 'blog'
    },

    writter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userModel'
    },

    main: String,

    image: [{
        type: String
    }],

    refarance: [{
        name: String,
        url: String
    }],

    updatedAt: {
        type: Date,
        default: Date.now
    },

    createdAt: Date
}, {
    timestamps: true
})

// add this doc to the user schema
blogSchema.post('save', async function (doc, next) {
    try {
        await mongoose.model("userModel").findByIdAndUpdate(
            doc.writter,
            {
                $push: {
                    blog: {
                        title: doc.title,
                        id: doc._id
                    }
                }
            }
        )
        next();
    } catch (err) {
        next(err)
    }
})

export default mongoose.model("blogModel", blogSchema);