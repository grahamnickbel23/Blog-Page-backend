import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        requred: true,
        unique: true
    },

    password:{
        type: String,
        requred: true
    },

    phone:[{
        countryCode:{
            type: String,
            default: '+91'
        },
        number: String
    }],

    name: String,

    gender:{
        type: String,
        enum:['male', 'female', 'prefer-not-say'],
        default: 'prefer-not-say'
    },

    downloadCV: String,

    skill:[{
        type: String
    }],

    organisation:[{
        name: String,
        position: String,
        timePeriod: String,
        work: String
    }],

    education:[{ 
        institute: String, 
        timePeriod: String, 
        digree: String
    }],

    certification:[{
        title: String,
        provider: String,
        accuredOn: Date,
        description: String,
        link: String
    }],

    about:String,

    blog:[{
        title: String,
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref:`blogModel`
        }
    }],

    profilePic:[{
        type: String
    }],

    socialMedia:[
        { plathform: String, link:String }
    ],

    lastLoggedIn:{
        type: Date,
        default: Date.now,
    },

    createdAt: Date

})

export default mongoose.model("userModel", userSchema);