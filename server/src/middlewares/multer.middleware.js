import multer from "multer";

// Multer configuration: store files in memory (no disk writes)
const storage = multer.memoryStorage();

export const upload = multer({ storage });
