import { Router } from 'express';
import multer from 'multer';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { prisma } from '../db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, '..', '..', 'uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage, limits: { fileSize: 15 * 1024 * 1024 } });

const router = Router();

router.get('/', async (req, res) => {
  const docs = await prisma.document.findMany({ include: { uploader: true }, orderBy: { createdAt: 'desc' } });
  res.json(docs);
});

router.post('/', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'file is required' });
  const doc = await prisma.document.create({
    data: {
      filename: req.file.originalname,
      path: `/uploads/${req.file.filename}`,
      size: req.file.size,
      uploadedBy: req.user.id,
    },
    include: { uploader: true },
  });
  res.status(201).json(doc);
});

router.delete('/:id', async (req, res) => {
  await prisma.document.delete({ where: { id: Number(req.params.id) } });
  res.status(204).end();
});

export default router;
