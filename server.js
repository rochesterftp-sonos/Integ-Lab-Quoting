const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3005;
const DATA_DIR = path.join(__dirname, 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

app.use(express.json());

// Serve static files (with and without proxy prefix)
const staticFiles = express.static(__dirname, { redirect: false });
app.use('/integ-lab-quoting', staticFiles);
app.use(staticFiles);

// API routes (support both prefixed and direct)
function getHandler(req, res) {
  const file = path.join(DATA_DIR, encodeURIComponent(req.params.key) + '.json');
  if (!fs.existsSync(file)) return res.json(null);
  try {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    res.json(data);
  } catch {
    res.json(null);
  }
}

function putHandler(req, res) {
  const file = path.join(DATA_DIR, encodeURIComponent(req.params.key) + '.json');
  fs.writeFileSync(file, JSON.stringify(req.body, null, 2));
  res.json({ ok: true });
}

function deleteHandler(req, res) {
  const file = path.join(DATA_DIR, encodeURIComponent(req.params.key) + '.json');
  if (fs.existsSync(file)) fs.unlinkSync(file);
  res.json({ ok: true });
}

app.get('/api/store/:key', getHandler);
app.put('/api/store/:key', putHandler);
app.delete('/api/store/:key', deleteHandler);
app.get('/integ-lab-quoting/api/store/:key', getHandler);
app.put('/integ-lab-quoting/api/store/:key', putHandler);
app.delete('/integ-lab-quoting/api/store/:key', deleteHandler);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`DevQuote running on http://0.0.0.0:${PORT}`);
});
