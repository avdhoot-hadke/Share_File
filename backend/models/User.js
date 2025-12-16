import mongoose from 'mongoose'

export const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please add username"]
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Please add email"]
    },
    password: {
        type: String,
        required: [true, "Please add password"]
    }
})

export default mongoose.model('User', UserSchema);
