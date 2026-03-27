import express from "express";
import authMiddleware from "../../middleware/post/auth";
import { validateRequestV2 } from "../../middleware/validation/validate-request-v2.middleware";
import {
    studentCreateSchemaV2,
    studentUpdateSchemaV2,
    studentIdParamSchemaV2,
} from "../../validation/student.validation.v2";

import {
    createStudentHandler,
    updateStudentHandler,
    deleteStudentHandler,
} from "../handler/student.handler";

const router = express.Router();

// CREATE STUDENT
router.post(
    "/",
    authMiddleware,
    validateRequestV2(studentCreateSchemaV2),
    createStudentHandler
);

// UPDATE STUDENT
router.put(
    "/:id",
    authMiddleware,
    validateRequestV2({ params: studentIdParamSchemaV2, body: studentUpdateSchemaV2 }),
    updateStudentHandler
);

// DELETE STUDENT
router.delete(
    "/:id",
    authMiddleware,
    validateRequestV2({ params: studentIdParamSchemaV2 }),
    deleteStudentHandler
);

export default router;