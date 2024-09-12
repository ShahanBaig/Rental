import mongoose from "mongoose";

/* MONGOOSE SETUP */
export const connectDatabase = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then((data) => {
      console.log("MongoDB connected with server: " + data.connection.host);
    });
};
