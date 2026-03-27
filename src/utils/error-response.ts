import { ZodError } from "zod";

export type ValidationIssue = {
    field: string;
    message: string;
};

export class ValidationError extends Error {
    code: string;
    errors: ValidationIssue[];

    constructor(message: string, errors: ValidationIssue[]) {
        super(message);
        this.name = "ValidationError";
        this.code = "VALIDATION_ERROR";
        this.errors = errors;
    }
}

export const formatZodErrors = (error: ZodError, location?: string): ValidationIssue[] => {
    return error.issues.map((issue) => {
        const path = issue.path.map((segment) => String(segment)).join(".");
        const field = path || location || "payload";

        return {
            field,
            message: issue.message,
        };
    });
};

export const buildValidationErrorResponse = (errors: ValidationIssue[]) => {
    return {
        success: false,
        code: "VALIDATION_ERROR",
        message: "Request validation failed",
        errors,
    };
};