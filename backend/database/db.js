import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config();

const DB = async () =>{
    try {
        const connect = await mongoose.connect(process.env.MONGO_DB_URL);
        console.log("Database connected");
    } catch (error) {
        console.log("DB ERROR:", error.message);
        console.error("Error connecting the database");
        process.exit(1); //immediately stops the Node.js program and tells the operating system that the program failed.
    }
}

export default DB;

