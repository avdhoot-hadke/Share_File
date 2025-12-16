import File from '../models/File.js';
import User from '../models/User.js';
import { cloudinary } from '../middlewares/uploadMiddleware.js';
import streamifier from 'streamifier';

const streamUpload = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { resource_type: 'auto' },
            (error, result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(error);
                }
            }
        );
        streamifier.createReadStream(buffer).pipe(stream);
    });
};

export const uploadFiles = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ msg: 'No files uploaded' });
        }

        const uploadedFiles = [];

        for (const file of req.files) {
            const result = await streamUpload(file.buffer);

            const newFile = new File({
                filename: file.originalname,
                secure_url: result.secure_url,
                public_id: result.public_id,
                format: result.format,
                sizeInBytes: result.bytes,
                owner: req.user.id
            });

            await newFile.save();
            uploadedFiles.push(newFile);
        }

        res.json(uploadedFiles);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

export const shareFile = async (req, res) => {
    const { fileId, email } = req.body;
    try {
        const file = await File.findById(fileId);
        if (!file) return res.status(404).json({ msg: 'File not found' });

        if (file.owner.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Not authorized' });
        }

        const userToShare = await User.findOne({ email });
        if (!userToShare) return res.status(404).json({ msg: 'User not found' });

        if (file.owner.toString() === userToShare._id.toString()) {
            return res.status(400).json({ msg: 'You cannot share with yourself' });
        }

        if (!file.sharedWith.includes(userToShare._id)) {
            file.sharedWith.push(userToShare._id);
            await file.save();
        }

        const link = `${process.env.CLIENT_URL}/file/view/${file._id}`;

        res.json({ msg: 'Shared successfully', link });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

export const accessFile = async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) return res.status(404).json({ msg: 'File not found' });

        const userId = req.user.id;
        const isOwner = file.owner.toString() === userId;
        const isShared = file.sharedWith.includes(userId);

        if (!isOwner && !isShared) {
            return res.status(403).json({ msg: 'Access Denied' });
        }

        res.json(file);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

export const getMyFiles = async (req, res) => {
    try {
        const files = await File.find({ owner: req.user.id }).sort({ createdAt: -1 });
        res.json(files);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

export const getSharedFiles = async (req, res) => {
    try {
        const files = await File.find({ sharedWith: req.user.id })
            .populate('owner', 'username email')
            .sort({ createdAt: -1 });
        res.json(files);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};