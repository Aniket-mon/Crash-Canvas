import { Request } from 'express';
import { IUser } from '../interfaces/user.interface';

export interface IMagicLinkPayload {
  userId: string;
  email: string;
  type: 'verification' | 'login';
  iat?: number;
  exp?: number;
}

export interface IAuthenticatedRequest extends Request {
  user: IUser;
}

export interface IMagicLinkResponse {
  success: boolean;
  message: string;
  data?: {
    email: string;
    linkSent: boolean;
  };
}

export interface IApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

export interface IValidationError {
  field: string;
  message: string;
}

export interface IEmailData {
  to: string;
  subject: string;
  html: string;
}
