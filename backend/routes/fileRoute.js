import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';
import { uploadFiles, shareFile, accessFile, getMyFiles, getSharedFiles } from '../controllers/fileController.js';

const router = express.Router();

router.post('/upload', verifyToken, upload.array('files', 5), uploadFiles);

router.post('/share', verifyToken, shareFile);

router.get('/:id', verifyToken, accessFile);

router.get('/list/my-files', verifyToken, getMyFiles);

router.get('/list/shared-with-me', verifyToken, getSharedFiles);

export default router;