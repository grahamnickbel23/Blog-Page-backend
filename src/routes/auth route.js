import express from 'express'
import auth from '../controller/auth logic.js';
import verifyToken from '../middelewere/jwtPerser Secure.js';
import wrapperFunction from '../utils/asyncHandeller utils.js';

const route = express.Router();

const { signup, signin, readProfile, editProfile } = auth
const { asyncHandeller } = wrapperFunction

// router for new user signup
route.post("/signup", verifyToken, asyncHandeller(signup, 'creating new user'));

// routre for user login
route.post("/signin", asyncHandeller(signin, 'logging exisiting user'));

// route for user profile
route.post("/profile", verifyToken, asyncHandeller(readProfile, 'getting user profile'))

// router for edit user
route.post("/updateuser", verifyToken, asyncHandeller(editProfile, 'editing info in userprofile'));

export default route;