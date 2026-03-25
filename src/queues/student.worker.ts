import { Worker } from "bullmq";
import { studentQueue, JOB_TYPES } from "./student.queue";
import { createStudent, updateStudent, deleteStudent } from "../v2/services/student.service";

// Worker create karo
const worker = new Worker(
    "studentQueue",
    async (job) => {
        console.log("📥 Job Received:", job.name);

        try {
            switch (job.name) {
                case JOB_TYPES.CREATE_STUDENT:
                    await createStudent(job.data);
                    console.log("✅ Student Created");
                    break;

                case JOB_TYPES.UPDATE_STUDENT:
                    await updateStudent(job.data);
                    console.log("✅ Student Updated");
                    break;

                case JOB_TYPES.DELETE_STUDENT:
                    await deleteStudent(job.data);
                    console.log("✅ Student Deleted");
                    break;

                default:
                    console.log("⚠️ Unknown Job Type:", job.name);
            }
        } catch (error) {
            console.error("❌ Worker Error:", error);
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
    console.log(`🎉 Job Completed: ${job.id}`);
});

worker.on("failed", (job, err) => {
    console.error(`❌ Job Failed: ${job?.id}`, err);
});