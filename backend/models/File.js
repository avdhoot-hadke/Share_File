import mongoose from 'mongoose';

const FileSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    secure_url: { type: String, required: true },
    public_id: { type: String, required: true },
    format: { type: String },
    sizeInBytes: { type: String },

    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    sharedWith: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            expiresAt: { type: Date, default: null }
        }
    ],
}, { timestamps: true });

export default mongoose.model('File', FileSchema);