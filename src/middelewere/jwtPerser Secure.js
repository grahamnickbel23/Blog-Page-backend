import jwt from "jsonwebtoken";
import userSchema from "../models/userSchema.js";

export default async function verifyToken(req, res, next) {
  try {

    // get the token from cookies
    const token = req.cookies?.access_token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token missing. Please log in."
      });
    }

    // verify the token
    const secret = process.env.JWT_KEY;
    const decoded = jwt.verify(token, secret);

    // attach decoded info
    req.token = decoded;
    req.sessionId = decoded.sessionId

    // return error if user does not exisit in DB
    const doesUserExisit = await userSchema.findById(decoded.userId)

    // if no user found return error
    if (!doesUserExisit){
      return res.status(400).json({
        success: false,
        message: `no user, error from token`
      })
    }

    next();

  } catch (err) {
    // handle invalid or expired token
    return res.status(403).json({
      success: false,
      message: "Invalid or expired token.",
      error: err.message
    });
  }
}
