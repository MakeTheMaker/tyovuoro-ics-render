const express = require("express");
const cors = require("cors");
const app = express();

// List of allowed origins
const allowedOrigins = [
    "https://makethemaker.github.io", // Production
    "http://127.0.0.1:5500"          // Local development
];

// Configure CORS to allow specific origins dynamically
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g., curl) or if origin is in allowed list
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, origin || "*"); // Reflect the origin or use "*" if no origin
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"]
}));

app.use(express.text()); // Parse plain text bodies

const icsStore = new Map();

app.post("/upload", (req, res) => {
    const id = Date.now().toString();
    icsStore.set(id, req.body);
    const url = `https://tyovuoro-ics-render.onrender.com/ics/${id}`;
    res.json({ url });
    setTimeout(() => icsStore.delete(id), 60 * 60 * 1000); // Cleanup after 1 hour
});

app.get("/ics/:id", (req, res) => {
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
