import { Request, Response, NextFunction } from "express";
import { ZodTypeAny } from "zod";
import { buildValidationErrorResponse, formatZodErrors, ValidationIssue } from "../../utils/error-response";

type SchemaGroup = {
    body?: ZodTypeAny;
    params?: ZodTypeAny;
    query?: ZodTypeAny;
};

export const validateRequestV2 = (schemas: ZodTypeAny | SchemaGroup) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const errors: ValidationIssue[] = [];
        const validated: { body?: any; params?: any; query?: any } = {};

        const schemaGroup: SchemaGroup =
            typeof (schemas as ZodTypeAny)?.safeParse === "function"
                ? { body: schemas as ZodTypeAny }
                : (schemas as SchemaGroup);

        if (schemaGroup.body) {
            const result = schemaGroup.body.safeParse(req.body);
            if (!result.success) {
                errors.push(...formatZodErrors(result.error, "body"));
            } else {
                validated.body = result.data;
            }
        }

        if (schemaGroup.params) {
            const result = schemaGroup.params.safeParse(req.params);
            if (!result.success) {
                errors.push(...formatZodErrors(result.error, "params"));
            } else {
                validated.params = result.data;
            }
        }

        if (schemaGroup.query) {
            const result = schemaGroup.query.safeParse(req.query);
            if (!result.success) {
                errors.push(...formatZodErrors(result.error, "query"));
            } else {
                validated.query = result.data;
            }
        }

        if (errors.length > 0) {
            const fields = errors.map((err) => err.field);
            console.error("Validation failed", {
                method: req.method,
                route: req.originalUrl,
                fields,
                validation_version: "v2",
            });

            return res.status(400).json(buildValidationErrorResponse(errors));
        }

        res.locals.validated = validated;
        return next();
    };
};