import { z } from "zod";

const phoneRegex = /^\+?[1-9]\d{9,14}$/;

export const studentIdParamSchemaV2 = z
    .object({
        id: z.string().trim().min(1, "id is required"),
    })
    .strict();

export const studentCreateSchemaV2 = z
    .object({
        name: z.string().trim().min(3, "name must be at least 3 characters").max(100, "name must be at most 100 characters"),
        email: z
            .string()
            .trim()
            .email("email must be a valid email")
            .refine((value) => value === value.toLowerCase(), "email must be lowercase"),
        age: z.number().int("age must be an integer").min(16, "age must be at least 16").max(100, "age must be at most 100").optional(),
        course: z.string().trim().min(2, "course must be at least 2 characters"),
        status: z.enum(["active", "inactive"]).optional(),
        phone: z.string().trim().regex(phoneRegex, "phone must be a valid phone number").optional(),
    })
    .strict();

const studentUpdateFieldsSchemaV2 = z
    .object({
        name: z.string().trim().min(3, "name must be at least 3 characters").max(100, "name must be at most 100").optional(),
        email: z
            .string()
            .trim()
            .email("email must be a valid email")
            .refine((value) => value === value.toLowerCase(), "email must be lowercase")
            .optional(),
        age: z.number().int("age must be an integer").min(16, "age must be at least 16").max(100, "age must be at most 100").optional(),
        course: z.string().trim().min(2, "course must be at least 2 characters").optional(),
        status: z.enum(["active", "inactive"]).optional(),
        phone: z.string().trim().regex(phoneRegex, "phone must be a valid phone number").optional(),
    })
    .strict();

export const studentUpdateSchemaV2 = studentUpdateFieldsSchemaV2.refine(
    (data) => Object.keys(data).length > 0,
    {
        message: "at least one field is required to update",
        path: [],
    }
);

export const studentCreateJobSchemaV2 = studentCreateSchemaV2;

export const studentUpdateJobSchemaV2 = studentUpdateFieldsSchemaV2
    .extend({
        id: z.string().trim().min(1, "id is required"),
    })
    .strict()
    .refine((data) => {
        const { id, ...rest } = data;
        return Object.keys(rest).length > 0;
    }, {
        message: "at least one field is required to update",
        path: [],
    });

export const studentDeleteJobSchemaV2 = z
    .object({
        id: z.string().trim().min(1, "id is required"),
    })
    .strict();