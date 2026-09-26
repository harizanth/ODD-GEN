import { prisma } from '../db.js';

export async function notify(userId, text) {
  try {
    return await prisma.notification.create({ data: { userId, text } });
  } catch (err) {
    console.warn('notify failed', err.message);
  }
}

export function orderNumber(prefix, count) {
  return `${prefix}-${String(1000 + count + 1)}`;
}
