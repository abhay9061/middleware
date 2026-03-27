import { ZodTypeAny } from "zod";
import { JOB_TYPES } from "../../queues/student.queue";
import {
    studentCreateJobSchemaV2,
    studentUpdateJobSchemaV2,
    studentDeleteJobSchemaV2,
} from "../../validation/student.validation.v2";
import { formatZodErrors, ValidationError } from "../../utils/error-response";

type JobName = typeof JOB_TYPES[keyof typeof JOB_TYPES];

type SchemaMap = Record<JobName, ZodTypeAny>;

const schemaMap: SchemaMap = {
    [JOB_TYPES.CREATE_STUDENT]: studentCreateJobSchemaV2,
    [JOB_TYPES.UPDATE_STUDENT]: studentUpdateJobSchemaV2,
    [JOB_TYPES.DELETE_STUDENT]: studentDeleteJobSchemaV2,
};

export const validateJobPayloadV2 = (jobName: JobName, payload: unknown) => {
    const schema = schemaMap[jobName];
    const result = schema.safeParse(payload);

    if (!result.success) {
        const errors = formatZodErrors(result.error, "payload");
        throw new ValidationError(`[VALIDATION_ERROR] ${jobName} payload invalid`, errors);
    }

    return result.data;
};