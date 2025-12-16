import { cloudinary } from "../middlewares/upload.middleware.js";
import streamifier from "streamifier";
import { User } from "../models/user.js";
import { File } from "../models/File.js";

const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: "auto" },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );

        streamifier.createReadStream(buffer).pipe(uploadStream);
    });
};

export const uploadFiles = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ msg: "No files uploaded" });
        }

        const uploadedFiles = [];

        for (const file of req.files) {
            const result = await uploadToCloudinary(file.buffer);

            const newFile = new File({
                filename: file.originalname,
                url: result.secure_url,
                publicId: result.public_id,
                fileType: result.format,
                fileSize: result.bytes,
                owner: req.user.id
            });

            await newFile.save();
            uploadedFiles.push(newFile);
        }

        res.json(uploadedFiles);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};

export const getMyFiles = async (req, res) => {
    try {
        const files = await File.find({ owner: req.user.id })
            .sort({ uploadedAt: -1 });

        res.json(files);
    } catch (err) {
        res.status(500).send("Server Error");
    }
};

export const shareFile = async (req, res) => {
    const { fileId, email } = req.body;

    try {
        const file = await File.findById(fileId);
        if (!file) {
            return res.status(404).json({ msg: "File not found" });
        }
        if (file.owner.toString() !== req.user.id) {
            return res.status(403).json({ msg: "Not authorized to share this file" });
        }
        const userToShare = await User.findOne({ email });
        if (!userToShare) {
            return res.status(404).json({ msg: "User not found" });
        }
        if (!file.sharedWith.includes(userToShare._id)) {
            file.sharedWith.push(userToShare._id);
            await file.save();
        }

        res.json({ msg: "File shared successfully" });
    } catch (err) {
        res.status(500).send("Server Error");
    }
};

export const accessFile = async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) {
            return res.status(404).json({ msg: "File not found" });
        }
        const userId = req.user.id;

        const isOwner = file.owner.toString() === userId;
        const isShared = file.sharedWith.some(
            (id) => id.toString() === userId
        );
        if (!isOwner && !isShared) {
            return res.status(403).json({
                msg: "Access Denied: You do not have permission to view this file."
            });
        }
        res.json(file);
    } catch (err) {
        res.status(500).send("Server Error");
    }
};

export const getSharedFiles = async (req, res) => {
    try {
        const files = await File.find({ sharedWith: req.user.id })
            .populate("owner", "email username");

        res.json(files);
    } catch (err) {
        res.status(500).send("Server Error");
    }
};
