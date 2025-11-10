import userSchema from "../models/userSchema.js";
import logger from "../logger/log logger.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import cryptoRandomString from "crypto-random-string";

export default class auth {

    // get the signup service
    static async signup(req, res) {

        // get the incoming info
        const data = req.body

        // cheak if the email alredy and return error if yes
        const doesUserExisit = await userSchema.findOne({ email: data.email });
        if (doesUserExisit) {
            return res.status(403).json({
                success: false,
                message: `user already exisit`
            })
        }

        // cashed the password
        data.password = await bcrypt.hash(data.password, 10);

        // save the info 
        const newUser = userSchema(data)
        await newUser.save();

        // log new usercreation
        logger.info(`${req.requestId} ${req.sessionId} new user created successfully`)

        return res.status(200).json({
            success: true,
            message: `new user ${data.email} registared successfully`
        })
    }

    // get signin sevice
    static async signin(req, res) {

        // get the incoming info
        const { email, password } = req.body;

        // cheak if the user exisit
        const doesUserExisit = await userSchema.findOne({email});

        // if user is there cheak for password
        const doesPassworsSame = await bcrypt.compare(password, doesUserExisit.password);

        // send error if no user or password worng
        if (!doesUserExisit || !doesPassworsSame) {
            return res.status(404).json({
                success: false,
                message: `no user found with this credential`
            })
        }

        // send acesstoken for 1 hrs
        const jwt_key = process.env.JWT_KEY;
        const sessionId = cryptoRandomString({ length: 10, type: 'numeric' })
        const accessToken = jwt.sign(
            {
                userId: doesUserExisit._id,
                sessionId: sessionId,
            },
            jwt_key,
            { expiresIn: '1h' }
        )

        // send cookies
        res.cookie("access_token", accessToken, {
            httpOnly: true,
            sameSite: "Lax",
            maxAge: 60 * 60 * 1000 // 1 hour
        });

        // create a log
        logger.info(`issued a new access token`)

        return res.status(200).json({
            success: true,
            message: `user successfully logged in`
        })
    }

    // profile api for read function
    static async readProfile (req, res){

        const { userId } = req.token;

        // cheak if any user is there or not
        const doesUserExisit = await userSchema.findById(userId);

        // if not return error
        if (!doesUserExisit){
            return res.status(400).json({
                success: false,
                message: `error in finding target user profile`
            })
        }

        // edit response
        const userInfo = doesUserExisit.toObject();
        delete userInfo.password;

        // create a log
        logger.info(`${req.requestId} ${req.sessionId} fetched profile of profileId: ${doesUserExisit._id}`)

        // if all ok return profile without password
        return res.status(200).json({
            success: true,
            message: userInfo
        })
    }

    // --- edit user info service ---
    static async editProfile(req, res) {

        const { userId } = req.token;
        const { field, info } = req.body;

        if (!field || info === undefined) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: field, or info"
            });
        }

        // let's find the user first
        const user = await userSchema.findById(userId);

        // due to nested updates using dynamic field path
        const updateObj = {};
        updateObj[field] = info;

        // update the user
        await userSchema.findOneAndUpdate(
            { email: user.email },
            { $set: updateObj },
            { new: true }
        );

        // log update
        logger.info(`${req.requestId} ${req.sessionId} updated field "${field}" for user ${user.email}`);

        return res.status(200).json({
            success: true,
            message: `User field "${field}" updated successfully`,
        });

    }

}