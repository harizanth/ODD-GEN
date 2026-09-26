import { Router } from 'express';
import { prisma } from '../db.js';

const router = Router();

router.get('/employees', async (req, res) => {
  const employees = await prisma.employee.findMany({
    include: { department: true, leaves: true },
    orderBy: { name: 'asc' },
  });
  res.json(employees);
});

router.post('/employees', async (req, res) => {
  const { name, role, departmentId, email } = req.body;
  if (!name || !role) return res.status(400).json({ error: 'name and role are required' });
  const employee = await prisma.employee.create({
    data: { name, role, email, departmentId: departmentId ? Number(departmentId) : undefined },
    include: { department: true },
  });
  res.status(201).json(employee);
});

router.put('/employees/:id', async (req, res) => {
  const employee = await prisma.employee.update({
    where: { id: Number(req.params.id) },
    data: req.body,
    include: { department: true },
  });
  res.json(employee);
});

router.get('/departments', async (req, res) => {
  const departments = await prisma.department.findMany({ include: { employees: true } });
  res.json(departments);
});

router.post('/departments', async (req, res) => {
  const department = await prisma.department.create({ data: { name: req.body.name } });
  res.status(201).json(department);
});

router.get('/leaves', async (req, res) => {
  const leaves = await prisma.leaveRequest.findMany({ include: { employee: true }, orderBy: { startDate: 'desc' } });
  res.json(leaves);
});

router.post('/leaves', async (req, res) => {
  const { employeeId, type, startDate, endDate } = req.body;
  if (!employeeId || !startDate || !endDate) return res.status(400).json({ error: 'employeeId, startDate, endDate are required' });
  const leave = await prisma.leaveRequest.create({
    data: { employeeId: Number(employeeId), type: type || 'annual', startDate: new Date(startDate), endDate: new Date(endDate) },
    include: { employee: true },
  });
  res.status(201).json(leave);
});

router.put('/leaves/:id', async (req, res) => {
  const leave = await prisma.leaveRequest.update({
    where: { id: Number(req.params.id) },
    data: { status: req.body.status },
    include: { employee: true },
  });
  if (leave.status === 'approved') {
    await prisma.employee.update({ where: { id: leave.employeeId }, data: { status: 'leave' } });
  }
  res.json(leave);
});

export default router;
