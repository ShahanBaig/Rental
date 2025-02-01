import express from "express"
import bodyParser from "body-parser"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import multer from "multer"
import helmet from "helmet"
import morgan from "morgan"
import path from "path"
import { fileURLToPath } from "url"
import userRoutes from "./routes/users.js";
import productRoutes from "./routes/products.js"
import reviewRoutes from "./routes/reviews.js"
import rentalRoutes from "./routes/rentals.js"
import paymentRoutes from "./routes/payments.js"
import { isAuthenticatedUser } from "./middleware/auth.js";
import User from "./models/User.js";
import errorMiddleware from "./middleware/error.js"
import { connectDatabase } from "./config/database.js"
import { ServerResponse } from "http"
import cookieParser from "cookie-parser"
// import { users, posts } from "./data/index.js";

/* UNHANDLED UNCAUGHT EXCEPTION */
process.on('uncaughtException', (err) => {
    console.log('Error: ' + err.message)
    console.log('Shutting down the server due to uncaught exception.')
    process.exit(1)
})

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from a file named .env into process.env.
dotenv.config({path: ".env"});

// Create an instance of the Express application.
const app = express();

// Allows the server to handle JSON-encoded request bodies.
app.use(express.json());

// Enables cookie parsing
app.use(cookieParser())

// Secure Express apps by setting various HTTP headers. Sets the Cross-Origin Resource Policy (CORP) header to "cross-origin."
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// Log HTTP requests.
app.use(morgan("common"));

// Parse incoming JSON requests and sets limit.
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

// Enables Cross-Origin HTTP requests.
app.use(cors());

// Serve static public files.  
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* ROUTES */
app.use("/api/v1", productRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", reviewRoutes);
app.use("/api/v1", rentalRoutes);
app.use("/api/v1", paymentRoutes);

app.use(errorMiddleware)

/* MONGOOSE SETUP */
connectDatabase()

/* START SERVER */
const PORT = process.env.PORT || 6001;
const server = app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));

/* UNHANDLED PROMISE REJECTION */ 
process.on("unhandledRejection", (err) => {
    console.log('Error: ' + err.message)
    console.log('Shutting down the server due to unhandled promise rejection.')

    server.close(() => {
        process.exit(1)
    })
})