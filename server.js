const express   = require('express');
const mongoose  = require('mongoose');
const cors      = require('cors');
const dotenv    = require('dotenv');
const http      = require('http');
const { Server } = require('socket.io');

dotenv.config();

const app    = express();
const server = http.createServer(app);
const io     = new Server(server, {
  cors: { origin: 'http://localhost:5173', methods: ['GET','POST'] }
});

// ── Middleware ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Make io accessible in routes ───────────────────────────
app.set('io', io);

// ── API Routes ─────────────────────────────────────────────
app.use('/api/auth',          require('./routes/authRoutes'));
app.use('/api/events',        require('./routes/eventRoutes'));
app.use('/api/registrations', require('./routes/registrationRoutes'));

app.get('/', (_req, res) => res.send('✅ College Event Management API Running'));

// ── Socket.IO ──────────────────────────────────────────────
io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);
  socket.on('disconnect', () => console.log('🔌 Client disconnected:', socket.id));
});

// ── Start ──────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    server.listen(process.env.PORT || 5000, () =>
      console.log(`✅ Server running → http://localhost:${process.env.PORT || 5000}`)
    );
  })
  .catch(err => console.error('❌ MongoDB error:', err.message));
