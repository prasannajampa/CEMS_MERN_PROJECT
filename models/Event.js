const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eventName:   { type: String, required: true },
  description: { type: String },
  date:        { type: Date, required: true },
  time:        { type: String, required: true },
  venue:       { type: String, required: true },
  eventType:   {
    type: String,
    enum: ['Technical', 'Cultural', 'Sports', 'Workshop', 'Seminar', 'Other'],
    default: 'Other'
  },
  maxParticipants: { type: Number, default: 100 },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
