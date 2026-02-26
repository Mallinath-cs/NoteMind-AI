import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const userSchema = new Schema({
    fullName:{
        type: String
    },
    email:{
        type: String
    },
    password:{
        type: String
    },
    createdOn:{
        type: Date,
        default: Date.now
    }
})

export default mongoose.model("User", userSchema);