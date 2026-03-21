import crypto from "crypto";

export const generateHashKey = (url: string): string => {
    const hash = crypto
        .createHash('sha256')
        .update(url)
        .digest('hex');

    return hash;
}