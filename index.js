import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import heroRoutes from "./routes/heroRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import specialistRoutes from "./routes/specialistRoutes.js";

dotenv.config();
const app = express();

app.use(cors({
    origin: "http://localhost:3000",  // your Next.js frontend
    credentials: true                 // if you need cookies / sessions
}));

app.use(express.json());

// Ensure uploads folder exists
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log("✅ Created uploads directory");
}

// Serve uploads folder statically
app.use("/uploads", express.static(uploadsDir));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
