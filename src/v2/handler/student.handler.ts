import { Request, Response } from "express";
import { studentQueue, JOB_TYPES } from "../../queues/student.queue";

export const createStudentHandler = async (req: Request, res: Response) => {
    try {
        const { name, email, course } = req.body;

        // ✅ VALIDATION
        if (!name || !email || !course) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format",
            });
        }

        await studentQueue.add(JOB_TYPES.CREATE_STUDENT, {
            name,
            email,
            course,
        });

        return res.status(200).json({
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

// ✅ UPDATE STUDENT HANDLER
export const updateStudentHandler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = req.body;

        await studentQueue.add(JOB_TYPES.UPDATE_STUDENT, {
            id,
            ...data,
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

// ✅ DELETE STUDENT HANDLER
export const deleteStudentHandler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        await studentQueue.add(JOB_TYPES.DELETE_STUDENT, {
            id,
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