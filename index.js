import dotenv from 'dotenv'
dotenv.config();

import express from 'express'
import cookieParser from 'cookie-parser';
import connectDB from './connectDB.js';
import enhancedLogger from './src/logger/enhanced logger.js'
import logger from './src/logger/log logger.js';
import { requestLogger } from './src/middelewere/requestLogger secure.js'
import authRoute from './src/routes/auth route.js'
import blogRoute from './src/routes/blog route.js'

const app = express();

// essextial middelewere
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);

// primary auth route
app.use("/auth", authRoute);
app.use("/blog", blogRoute);

const PORT = process.env.PORT || 3000;

// connect DB
connectDB();

app.get("/home", (req, res) => {
    logger.info(`basic api route working`)
    return res.status(200).json({
        success: true,
        message: "will convert to GO lang with in next 6 months"
    })
})

// ---- Server Startup ----
app.listen(PORT, () => {
    enhancedLogger.appStart(`Server is running on port: ${PORT}`);
});

// ---- Graceful Shutdown ----
process.on("SIGINT", async () => {
    enhancedLogger.appShutdown("SIGINT received (manual stop with Ctrl+C)");
    await cleanUp();
    process.exit(0);
});

// ---- Sudden Shutdown ----
process.on("SIGTERM", async () => {
    enhancedLogger.appShutdown("SIGTERM received (system stop / Docker kill)");
    await cleanUp();
    process.exit(0);
});