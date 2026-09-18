const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const DATA_FILE = path.join(__dirname, 'data', 'posts.json');
const UPLOAD_DIR = path.join(__dirname, 'uploads');

// --- one-time setup ---
if (!fs.existsSync(path.dirname(DATA_FILE))) fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// --- image upload config ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '';
    cb(null, 'img_' + Date.now() + '_' + Math.round(Math.random() * 1e6) + ext);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB
  fileFilter: (req, file, cb) => {
    if (/^image\/(jpeg|png|gif|webp)$/.test(file.mimetype)) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  }
});

app.use(express.json());
app.use('/uploads', express.static(UPLOAD_DIR));
app.use(express.static(path.join(__dirname, 'public')));

function readPosts() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}
function writePosts(list) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2));
}

// --- API ---
app.get('/api/posts', (req, res) => {
  res.json(readPosts());
});

app.post('/api/posts', upload.single('image'), (req, res) => {
  const { title, tag, excerpt, author } = req.body;
  if (!title || !excerpt) {
    return res.status(400).json({ error: 'Missing title or excerpt' });
  }
  const posts = readPosts();
  const post = {
    id: 'p' + Date.now(),
    title: title.trim(),
    tag: (tag || 'News').trim(),
    excerpt: excerpt.trim(),
    author: (author || 'MTV Newsroom').trim(),
    date: new Date().toISOString().slice(0, 10),
    image: req.file ? ('/uploads/' + req.file.filename) : null
  };
  posts.unshift(post);
  writePosts(posts);
  res.json(post);
});

app.delete('/api/posts/:id', (req, res) => {
  let posts = readPosts();
  const toDelete = posts.find(p => p.id === req.params.id);
  posts = posts.filter(p => p.id !== req.params.id);
  writePosts(posts);
  if (toDelete && toDelete.image) {
    fs.unlink(path.join(__dirname, toDelete.image), () => {});
  }
  res.json({ ok: true });
});

app.use((err, req, res, next) => {
  res.status(400).json({ error: err.message || 'Something went wrong' });
});

app.listen(PORT, () => {
  console.log(`MTV is running at http://localhost:${PORT}`);
});
