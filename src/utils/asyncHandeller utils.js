import logger from "../logger/log logger.js";

export default class wrapperFunction{

    static asyncHandeller = (fnc, response) => async (req, res, next) => {
        try{
            await fnc(req, res, next);
        }catch (err){

            // genarate log after sucessful execution
            logger.error(`${req.requestId} ${req.sessionId} error: ${err.message}`)

            return res.status(500).json({
                success: false,
                message: `error in ${response}`,
                error: err.message
            })
        }
    }
}