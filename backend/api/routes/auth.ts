import express, { Router, Request, Response } from 'express';
import { register, login} from '../controllers/authController';
import { validateRegistration, validateLogin } from '../middleware/validation';

const router: Router = express.Router();

router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);


router.get('/health', (_req: Request, res: Response) => {
  const response = {
    success: true,
    message: 'Server is running',
    data: {
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString()
    }
  };
  res.status(200).json(response);
});

export default router;
