const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3005;
const DATA_DIR = path.join(__dirname, 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

app.use(express.json());
app.use(express.static(__dirname));

// Get all stored keys (or a specific key)
app.get('/api/store/:key', (req, res) => {
  const file = path.join(DATA_DIR, encodeURIComponent(req.params.key) + '.json');
  if (!fs.existsSync(file)) return res.json(null);
  try {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    res.json(data);
  } catch {
    res.json(null);
  }
});

// Save a key
app.put('/api/store/:key', (req, res) => {
  const file = path.join(DATA_DIR, encodeURIComponent(req.params.key) + '.json');
  fs.writeFileSync(file, JSON.stringify(req.body, null, 2));
  res.json({ ok: true });
});

// Delete a key
app.delete('/api/store/:key', (req, res) => {
  const file = path.join(DATA_DIR, encodeURIComponent(req.params.key) + '.json');
  if (fs.existsSync(file)) fs.unlinkSync(file);
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`DevQuote running at http://localhost:${PORT}/devquote.html`);
});
