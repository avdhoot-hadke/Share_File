import mongoose, { Mongoose } from "mongoose";

const fileSchema = mongoose.Schema({
    filename: {
        type: String, required: true
    },
    secure_url: {
        type: String, required: true
    },
    public_id: {
        type: String, required: true
    },
    format: {
        type: String
    },
    sizeInBytes: {
        type: String
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true
    },
    sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    uploadedAt: {
        type: Date, default: Date.now
    },
})

export const File = mongoose.model("File", fileSchema)