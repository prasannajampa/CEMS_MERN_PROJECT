const express      = require('express');
const router       = express.Router();
const Event        = require('../models/Event');
const Registration = require('../models/Registration');
const { protect }  = require('../middleware/authMiddleware');

// GET /api/events  — public
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 }).populate('createdBy', 'adminName');
    res.json(events);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/events/:id  — public
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('createdBy', 'adminName');
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/events  — admin only
router.post('/', protect, async (req, res) => {
  if (req.user.role !== 'admin')
    return res.status(403).json({ message: 'Admins only' });
  try {
    const event = await Event.create({ ...req.body, createdBy: req.user.id });
    // Notify via socket
    req.app.get('io').emit('newEvent', event);
    res.status(201).json(event);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT /api/events/:id  — admin only
router.put('/:id', protect, async (req, res) => {
  if (req.user.role !== 'admin')
    return res.status(403).json({ message: 'Admins only' });
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(event);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /api/events/:id  — admin only
router.delete('/:id', protect, async (req, res) => {
  if (req.user.role !== 'admin')
    return res.status(403).json({ message: 'Admins only' });
  try {
    await Event.findByIdAndDelete(req.params.id);
    await Registration.deleteMany({ eventId: req.params.id });
    res.json({ message: 'Event deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/events/:id/registrations  — admin only
router.get('/:id/registrations', protect, async (req, res) => {
  if (req.user.role !== 'admin')
    return res.status(403).json({ message: 'Admins only' });
  try {
    const regs = await Registration.find({ eventId: req.params.id })
      .populate('studentId', 'studentName email rollNumber department');
    res.json(regs);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
