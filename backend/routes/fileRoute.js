import express from "express";
import auth from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import { getMyFiles, uploadFiles, getMyFiles, shareFile, accessFile, getSharedFiles } from "../controllers/fileController.js";

const fileRouter = express.Router();

fileRouter.post("/upload", auth, upload.array("files", 5), uploadFiles);

fileRouter.get("/my-files", auth, getMyFiles);

fileRouter.get("/shared-with-me", auth, getSharedFiles);

fileRouter.post("/share", auth, shareFile);

fileRouter.get("/:id", auth, accessFile);

export default fileRouter;
