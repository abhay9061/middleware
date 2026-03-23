import express from "express";
const router = express.Router();

import { apiKeyMiddleware } from "../middleware/pre/auth.middleware";
import { postCacheMiddleware } from "../middleware/post/post-cache.middleware";

import {
    createStudentHandler,
    studentListHandler,
    getStudentByIdHandler,
    updateStudentHandler,
    deleteStudentHandler
} from "../handler/student.handler";

// CREATE
router.post("/", apiKeyMiddleware, createStudentHandler, postCacheMiddleware);

// GET ALL
router.get("/",
    apiKeyMiddleware,
    studentListHandler,
    postCacheMiddleware
);

// GET BY ID
router.get(
    "/:id",
    apiKeyMiddleware,
    getStudentByIdHandler,
    postCacheMiddleware
);

// UPDATE
router.put(
    "/:id",
    apiKeyMiddleware,
    updateStudentHandler,
    postCacheMiddleware
);

// DELETE
router.delete(
    "/:id",
    apiKeyMiddleware,
    deleteStudentHandler,
    postCacheMiddleware
);

export default router;