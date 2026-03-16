import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { prisma } from '@/db/client';
import projectRoutes from '@/routes/projects';
import taskRoutes from '@/routes/tasks';
import scheduleRoutes from '@/routes/schedule';
import meetingRoutes from '@/routes/meetings';
import contactRoutes from '@/routes/contacts';
import documentRoutes from '@/routes/documents';
import changelogRoutes from '@/routes/changelog';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/changelogs', changelogRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
});
