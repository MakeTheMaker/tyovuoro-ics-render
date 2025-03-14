const express = require("express");
const app = express();
app.use(express.text()); // Parse plain text body (ICS content)

const icsStore = new Map(); // In-memory storage for ICS files

// Endpoint to upload ICS content and return a URL
app.post("/upload", (req, res) => {
  const id = Date.now().toString(); // Unique ID based on timestamp
  icsStore.set(id, req.body); // Store ICS content
  const url = `https://tyovuoro-ics-render.onrender.com/ics/${id}`;
  res.json({ url });
  // Clean up after 1 hour
  setTimeout(() => icsStore.delete(id), 60 * 60 * 1000);
});

// Endpoint to serve ICS content
app.get("/ics/:id", (req, res) => {
  const ics = icsStore.get(req.params.id);
  if (ics) {
    res.set("Content-Type", "text/calendar");
    res.send(ics);
  } else {
    res.status(404).send("ICS file not found");
  }
});

const port = process.env.PORT || 3000; // Render sets PORT env variable
app.listen(port, () => console.log(`Server running on port ${port}`));
