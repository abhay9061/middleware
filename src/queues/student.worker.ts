import { Worker } from "bullmq";
import { JOB_TYPES } from "./student.queue";
import { createStudent, updateStudent, deleteStudent } from "../v2/services/student.service";
import { validateJobPayloadV2 } from "../worker/validation/validate-job-payload-v2";
import { ValidationError } from "../utils/error-response";

// Worker create karo
const worker = new Worker(
    "studentQueue",
    async (job) => {
        console.log("Job Received:", job.name);

        try {
            switch (job.name) {
                case JOB_TYPES.CREATE_STUDENT: {
                    const payload = validateJobPayloadV2(job.name, job.data);
                    await createStudent(payload);
                    console.log("Student Created");
                    break;
                }

                case JOB_TYPES.UPDATE_STUDENT: {
                    const payload = validateJobPayloadV2(job.name, job.data);
                    await updateStudent(payload);
                    console.log("Student Updated");
                    break;
                }

                case JOB_TYPES.DELETE_STUDENT: {
                    const payload = validateJobPayloadV2(job.name, job.data);
                    await deleteStudent(payload);
                    console.log("Student Deleted");
                    break;
                }

                default:
                    console.log("Unknown Job Type:", job.name);
            }
        } catch (error: any) {
            if (error instanceof ValidationError) {
                console.error("Worker Validation Error", {
                    jobName: job.name,
                    jobId: job.id,
                    errors: error.errors,
                });
            }

            console.error("Worker Error:", error);
            throw error; // important for retry mechanism
        }
    },
    {
        connection: {
            url: process.env.REDIS_URL,
        },
    }
);

// Worker events (optional but useful)
worker.on("completed", (job) => {
    console.log(`Job Completed: ${job.id}`);
});

worker.on("failed", (job, err) => {
    console.error(`Job Failed: ${job?.id}`, err);
});