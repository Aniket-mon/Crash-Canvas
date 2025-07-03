import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database';
import authRoutes from './routes/auth';
import { IApiResponse } from './types';


dotenv.config();

const app: Application = express();

(async () => {
  try {
    await connectDB();
  } catch (error) {
    console.error('Failed to connect to database:', error);
    process.exit(1);
  }
})();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    exposedHeaders: ['Authorization']
  })
);

app.use('/api/auth', authRoutes);

app.get('/api/health', (_: Request, res: Response) => {
  const response: IApiResponse = {
    success: true,
    message: 'Server is running',
    data: {
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString()
    }
  };
  res.status(200).json(response);
});

app.use(
  (err: Error, _req: Request, res: Response, _: NextFunction): void => {
    console.error('Unhandled error:', err);
    const response: IApiResponse = {
    success: false,
    message: 'Internal server error'
    };

    if (process.env.NODE_ENV === 'development') {
    response.errors = [err.message];
    }
    res.status(500).json(response);
  }
);

app.use((req: Request, res: Response) => {
  const response: IApiResponse = {
    success: false,
    message: `Route ${req.originalUrl} not found`
  };
  res.status(404).json(response);
});

// server start
const PORT = parseInt(process.env.PORT || '5000', 10);
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`📍 Backend URL: http://localhost:${PORT}`);
});


export default app;
