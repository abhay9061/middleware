import express from "express";
import authMiddleware from "../../middleware/post/auth";

import {
    createStudentHandler,
    updateStudentHandler,
    deleteStudentHandler,
} from "../handler/student.handler";

const router = express.Router();

// ✅ CREATE STUDENT
router.post("/", authMiddleware, createStudentHandler);

// ✅ UPDATE STUDENT
router.put("/:id", authMiddleware, updateStudentHandler);

// ✅ DELETE STUDENT
router.delete("/:id", authMiddleware, deleteStudentHandler);

export default router;