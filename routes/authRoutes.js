const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const Admin   = require('../models/Admin');
const Student = require('../models/Student');

const genToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });

// ── POST /api/auth/register-admin ──────────────────────────
router.post('/register-admin', async (req, res) => {
  const { adminName, email, password } = req.body;
  try {
    if (await Admin.findOne({ email }))
      return res.status(400).json({ message: 'Admin already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const admin  = await Admin.create({ adminName, email, password: hashed });

    res.status(201).json({
      message: 'Admin registered',
      token: genToken(admin._id, 'admin'),
      user:  { id: admin._id, name: admin.adminName, email: admin.email, role: 'admin' }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/auth/register-student ───────────────────────
router.post('/register-student', async (req, res) => {
  const { studentName, rollNumber, email, department, password } = req.body;
  try {
    if (await Student.findOne({ email }))
      return res.status(400).json({ message: 'Student already exists' });

    const hashed  = await bcrypt.hash(password, 10);
    const student = await Student.create({
      studentName, rollNumber, email, department, password: hashed
    });

    res.status(201).json({
      message: 'Student registered',
      token: genToken(student._id, 'student'),
      user:  {
        id: student._id, name: student.studentName,
        email: student.email, department: student.department,
        rollNumber: student.rollNumber, role: 'student'
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/auth/login ───────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const user = role === 'admin'
      ? await Admin.findOne({ email })
      : await Student.findOne({ email });

    if (!user) return res.status(404).json({ message: 'User not found' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: 'Incorrect password' });

    const userData = role === 'admin'
      ? { id: user._id, name: user.adminName, email: user.email, role }
      : { id: user._id, name: user.studentName, email: user.email,
          department: user.department, rollNumber: user.rollNumber, role };

    res.json({ message: 'Login successful', token: genToken(user._id, role), user: userData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
