import mongoose from 'mongoose';

const FileSchema = new mongoose.Schema({
    filename: { type: String, required: [true, "Give file a name"] },
    secure_url: { type: String, required: [true, "Give Url"] },
    public_id: { type: String, required: [true, "Give public id"] },
    format: { type: String },
    sizeInBytes: { type: String },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', required: true
    },
    sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    expiresAt: { type: Date, default: null }
}, { timestamps: true });

export default mongoose.model('File', FileSchema);