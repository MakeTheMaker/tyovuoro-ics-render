const express = require("express");
const cors = require("cors");
const app = express();

// Enable CORS for all routes, allowing requests from your GitHub Pages origin
app.use(cors({
    origin: ["https://makethemaker.github.io", "http://127.0.0.1:5500/"], // Restrict to your GitHub Pages domain
    methods: ["GET", "POST", "OPTIONS"],     // Allow necessary methods
    allowedHeaders: ["Content-Type"],        // Allow your request header
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
