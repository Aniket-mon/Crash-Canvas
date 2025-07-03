import { Document } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  
}

export interface IUserRegistration {
  name: string;
  email: string;
}

export interface IUserLogin {
  email: string;
}

