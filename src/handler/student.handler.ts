import { Request, Response, NextFunction } from "express";
import { withExecution } from "../utils/with-execution";

import {
    createStudentService,
    getStudentsService,
    getStudentByIdService,
    updateStudentService,
    deleteStudentService
} from "../services/student.service";

// Helper
const toSingle = (value: any): string | undefined => {
    if (Array.isArray(value)) return value[0];
    return value as string | undefined;
};

// CREATE
export const createStudentHandler = withExecution(async (req: Request, res: Response, next: NextFunction) => {
    const result = await createStudentService(req.body);

    res.locals.responseBody = {
        success: true,
        message: "Student created successfully",
        data: result,
    };

    res.locals.statusCode = 201;

    next();
});

// GET LIST
export const studentListHandler = withExecution(async (req: Request, res: Response, next: NextFunction) => {
    const course = toSingle(req.query.course);
    const page = toSingle(req.query.page);
    const limit = toSingle(req.query.limit);

    const result = await getStudentsService({
        course,
        page,
        limit,
    });

    res.locals.responseBody = {
        success: true,
        message: "Student list fetched successfully",
        data: result.data,
        page: result.page,
        limit: result.limit,
    };

    res.locals.statusCode = 200;

    next();
});

// GET BY ID
export const getStudentByIdHandler = withExecution(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string; // ✅ FIX

    const result = await getStudentByIdService(id);

    res.locals.responseBody = {
        success: true,
        data: result,
    };

    res.locals.statusCode = 200;

    next();
});

// UPDATE
export const updateStudentHandler = withExecution(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string; // ✅ FIX

    const result = await updateStudentService(id, req.body);

    res.locals.responseBody = {
        success: true,
        message: "Student updated successfully",
        data: result,
    };

    res.locals.statusCode = 200;

    next();
});

// DELETE
export const deleteStudentHandler = withExecution(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string; // ✅ FIX

    await deleteStudentService(id);

    res.locals.responseBody = {
        success: true,
        message: "Student deleted successfully",
    };

    res.locals.statusCode = 200;

    next();
});