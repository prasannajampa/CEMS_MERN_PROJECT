const express      = require('express');
const router       = express.Router();
const Registration = require('../models/Registration');
const { protect }  = require('../middleware/authMiddleware');

// POST /api/registrations  — student registers for event
router.post('/', protect, async (req, res) => {
  if (req.user.role !== 'student')
    return res.status(403).json({ message: 'Students only' });

  const { eventId } = req.body;
  try {
    const already = await Registration.findOne({ studentId: req.user.id, eventId });
    if (already) return res.status(400).json({ message: 'Already registered' });

    const reg = await Registration.create({ studentId: req.user.id, eventId });
    res.status(201).json({ message: 'Registered successfully', registration: reg });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/registrations/my  — student's own registrations
router.get('/my', protect, async (req, res) => {
  try {
    const regs = await Registration.find({ studentId: req.user.id })
      .populate('eventId', 'eventName date time venue eventType description');
    res.json(regs);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/registrations/stats  — admin stats
router.get('/stats', protect, async (req, res) => {
  if (req.user.role !== 'admin')
    return res.status(403).json({ message: 'Admins only' });
  try {
    const total = await Registration.countDocuments();
    res.json({ total });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /api/registrations/:id  — cancel registration
router.delete('/:id', protect, async (req, res) => {
  try {
    await Registration.findByIdAndDelete(req.params.id);
    res.json({ message: 'Registration cancelled' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
