import { Request, Response, NextFunction, RequestHandler } from 'express';
import { IApiResponse, IValidationError } from '../types';
import { IUserRegistration, IUserLogin } from '../interfaces/user.interface';

export const validateRegistration: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { name, email }: IUserRegistration = req.body;
  const errors: IValidationError[] = [];

  // Name validation
  if (!name || name.trim().length < 2) {
    errors.push({
      field: 'name',
      message: 'Name must be at least 2 characters long'
    });
  }

  if (name && name.trim().length > 50) {
    errors.push({
      field: 'name',
      message: 'Name cannot exceed 50 characters'
    });
  }

  // Email validation
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push({
      field: 'email',
      message: 'Please provide a valid email address'
    });
  }

  if (errors.length > 0) {
    const response: IApiResponse = {
      success: false,
      message: 'Validation failed',
      errors: errors.map(err => err.message)
    };
    res.status(400).json(response);
    return;
  }

  next();
};

export const validateLogin: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { email }: IUserLogin = req.body;
  const errors: IValidationError[] = [];

  // Email validation
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push({
      field: 'email',
      message: 'Please provide a valid email address'
    });
  }

  if (errors.length > 0) {
    const response: IApiResponse = {
      success: false,
      message: 'Validation failed',
      errors: errors.map(err => err.message)
    };
    res.status(400).json(response);
    return;
  }

  next();
};

export const validateToken: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    const response: IApiResponse = {
      success: false,
      message: 'Valid token is required'
    };
    res.status(400).json(response);
    return;
  }

  next();
};
