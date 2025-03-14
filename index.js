const express = require("express");
const cors = require("cors");
const app = express();

// List of allowed origins for /upload
const allowedOrigins = [
    "https://makethemaker.github.io",
    "http://127.0.0.1:5500"
];

// CORS for /upload: only allow specific origins
const uploadCors = cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, origin || "*");
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"]
});

// CORS for /ics/:id: allow all origins
const icsCors = cors({
    origin: "*", // Allow any origin to fetch ICS files
    methods: ["GET", "OPTIONS"]
});

app.use(express.text());

// Apply CORS middleware to specific routes
app.options("/upload", uploadCors); // Handle preflight for /upload
app.post("/upload", uploadCors, (req, res) => {
    const id = Date.now().toString();
    icsStore.set(id, req.body);
    const url = `https://tyovuoro-ics-render.onrender.com/ics/${id}`;
    res.json({ url });
    setTimeout(() => icsStore.delete(id), 60 * 60 * 1000);
});

app.get("/ics/:id", icsCors, (req, res) => {
    const ics = icsStore.get(req.params.id);
    if (ics) {
        res.set("Content-Type", "text/calendar");
        res.send(ics);
    } else {
        res.status(404).send("ICS file not found");
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
