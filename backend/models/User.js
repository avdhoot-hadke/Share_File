import mongoose from 'mongoose'

export const userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: [true, "Please add username"]
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Please add email"]
    },
    password: {
        type: string,
        required: [true, "Please add password"]
    }
})

export const User = mongoose.model("User", userSchema);