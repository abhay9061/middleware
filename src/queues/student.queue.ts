import { Queue } from "bullmq";
import redisConnection from "../config/redis";

// Queue Name
export const studentQueue = new Queue("studentQueue", {
    connection: {
        url: process.env.REDIS_URL,
    },
});

// Job Types (constants)
export const JOB_TYPES = {
    CREATE_STUDENT: "CREATE_STUDENT",
    UPDATE_STUDENT: "UPDATE_STUDENT",
    DELETE_STUDENT: "DELETE_STUDENT",
};