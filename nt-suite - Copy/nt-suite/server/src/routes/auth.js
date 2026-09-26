import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../db.js';

const router = Router();

function sign(user) {
  const secret = process.env.JWT_SECRET || 'ntos-enterprise-jwt-secret-key-2026';
  return jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role, color: user.color },
    secret,
    { expiresIn: '7d' }
  );
}

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'name, email, password are required' });

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ error: 'An account with that email already exists' });

  const passwordHash = await bcrypt.hash(password, 10);
  const isFirstUser = (await prisma.user.count()) === 0;
  const colors = ['#714B67', '#017E84', '#E67E22', '#28A745'];
  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: isFirstUser ? 'admin' : 'user',
      color: colors[Math.floor(Math.random() * colors.length)],
    },
  });

  res.json({ token: sign(user), user: { id: user.id, name: user.name, email: user.email, role: user.role, color: user.color } });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  res.json({
    token: sign(user),
    user: { id: user.id, name: user.name, email: user.email, role: user.role, color: user.color }
  });
});

export default router;
