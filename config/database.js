import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connect = () => {
    mongoose.connect(process.env.MONGODB_URL||'mongodb://localhost:27017/CTF', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("DB connected successfully");
    })
    .catch((err) => {
        console.log("DB CONNECTION ISSUES");
        console.error(err);
        process.exit(1);
    });
};
