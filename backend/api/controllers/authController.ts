import { Request, Response, RequestHandler } from 'express';
import User from '../models/user';
import { IUserRegistration, IUserLogin } from '../interfaces/user.interface';

const sendError = (res: Response, statusCode: number, message: string): void => {
  res.status(statusCode).json({
    success: false,
    message
  });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email }: IUserRegistration = req.body;
    if (!name || !email) return sendError(res, 400, 'Name and email are required');

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return sendError(res, 400, 'User with this email already exists');
    }

    await User.create({
      name: name.trim(),
      email: normalizedEmail
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please log in.'
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

export const login: RequestHandler = async (req, res) => {
  try {
    const { email }: IUserLogin = req.body;
    if (!email) return sendError(res, 400, 'Email is required');

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) return sendError(res, 404, 'No account found with this email address');

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        id: user._id.toString(),
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    sendError(res, 500, 'Server error during login request');
  }
};

