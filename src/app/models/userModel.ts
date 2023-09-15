import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: [true, "Please provide a username"],
        unique: true,
    },
    email: {
        type: String,
        require: [true, "Please provide a email"],
        unique: true,
    },
    password: {
        type: String,
        require: [true, "Please provide a password"],
    },
    isVerfied:{
        type: Boolean,
        default: false,
    },
    isAdmin:{
        type: Boolean,
        default: false,
    },
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpy: Date,

})

export default mongoose.models.User || mongoose.model('User', userSchema);