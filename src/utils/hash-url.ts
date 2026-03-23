import crypto from "crypto";

export const generateHashKey = (input: string): string => {
    return crypto.
        createHash("sha256").
        update(input).
        digest("hex");
};