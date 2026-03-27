import { Request, Response } from "express";
import { studentQueue, JOB_TYPES } from "../../queues/student.queue";

export const createStudentHandler = async (req: Request, res: Response) => {
    try {
        const payload = res.locals.validated?.body ?? req.body;

        await studentQueue.add(JOB_TYPES.CREATE_STUDENT, payload);

        return res.status(201).json({
            success: true,
            message: "Student creation job queued successfully",
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// UPDATE STUDENT HANDLER
export const updateStudentHandler = async (req: Request, res: Response) => {
    try {
        const params = res.locals.validated?.params ?? req.params;
        const body = res.locals.validated?.body ?? req.body;

        await studentQueue.add(JOB_TYPES.UPDATE_STUDENT, {
            id: params.id,
            ...body,
        });

        return res.status(200).json({
            success: true,
            message: "Student update job queued successfully",
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// DELETE STUDENT HANDLER
export const deleteStudentHandler = async (req: Request, res: Response) => {
    try {
        const params = res.locals.validated?.params ?? req.params;

        await studentQueue.add(JOB_TYPES.DELETE_STUDENT, {
            id: params.id,
        });

        return res.status(200).json({
            success: true,
            message: "Student deletion job queued successfully",
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};