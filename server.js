import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import apartmentRoutes from "./routes/apartmentRoutes.js";

dotenv.config();
const app = express();


// Middleware: CORS (allow Next.js frontend)
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

// Ensure CORS preflight (OPTIONS) is handled globally before other middleware
// Use '*' for OPTIONS to avoid path-to-regexp errors with patterns like '/api/*'
// Handle CORS preflight requests (OPTIONS) before other middleware
app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        return res.sendStatus(200);
    }
    next();
});

// Middleware for parsing JSON bodies
app.use(express.json());

// Middleware for parsing URL-encoded bodies (form data)
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Middleware to log all requests
app.use((req, res, next) => {
    console.log('Incoming request:', {
        method: req.method,
        path: req.path,
        headers: req.headers,
        body: req.body
    });
    next();
});

// Disable caching for API responses to avoid 304 Not Modified in development
app.use('/api', (req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.set('Surrogate-Control', 'no-store');
    next();
});

// Routes
app.use("/api/apartments", apartmentRoutes);

// Global error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    if (res.headersSent) return next(err);
    res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
