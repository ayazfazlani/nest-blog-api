// src/users/entities/user.entity.ts
// Similar to Laravel Eloquent Model
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 'reader' })
  role: UserRole;

  @Prop({ default: false })
  isActive: boolean;

  @Prop({ default: false })
  isEmailVerified: boolean;
}

export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  AUTHOR = 'author',
  READER = 'reader',
}

export const UserSchema = SchemaFactory.createForClass(User);