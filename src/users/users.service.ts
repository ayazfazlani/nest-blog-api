// src/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable() // Makes this class injectable (Dependency Injection)
export class UsersService {
  // InjectModel connects User entity to MongoDB collection
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  // CREATE - Add new user
  async create(createUserDto: CreateUserDto): Promise<User> {
    console.log('🔨 Creating user:', createUserDto.email);
    
    // Step 1: Hash password before saving
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    
    // Step 2: Create new user instance
    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    
    // Step 3: Save to database
    const savedUser = await newUser.save();
    
    // Step 4: Remove password from response
    const userObject = savedUser.toObject();
    delete (userObject as any).password;
    
    console.log('✅ User created:', savedUser.email);
    return userObject as User;
  }

  // READ - Get all users
  async findAll(): Promise<User[]> {
    console.log('📋 Fetching all users');
    
    // Find all users, exclude password field
    const users = await this.userModel
      .find()
      .select('-password') // Exclude password
      .exec();
    
    console.log(`📊 Found ${users.length} users`);
    return users;
  }

  // READ - Get single user by ID
  async findOne(id: string): Promise<User> {
    console.log('🔍 Finding user with ID:', id);
    
    // Find user by ID
    const user = await this.userModel
      .findById(id)
      .select('-password')
      .exec();
    
    // If user not found, throw error
    if (!user) {
      console.log('❌ User not found');
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    console.log('✅ User found:', user.email);
    return user;
  }

  // READ - Get user by email (for login)
  async findByEmail(email: string): Promise<User | null> {
    console.log('📧 Finding user by email:', email);
    
    const user = await this.userModel
      .findOne({ email })
      .select('+password') // Include password for validation
      .exec();
    
    return user;
  }

  // UPDATE - Update user
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    console.log('🔄 Updating user:', id);
    
    // Step 1: Find user first
    const existingUser = await this.userModel.findById(id).exec();
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    // Step 2: Hash password if being updated
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    
    // Step 3: Update user
    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        id,
        { $set: updateUserDto }, // $set only updates provided fields
        { new: true, runValidators: true }, // Return updated doc, run validations
      )
      .select('-password')
      .exec();
    
    console.log('✅ User updated:', updatedUser?.email);
    return updatedUser as unknown as User;
  }

  // DELETE - Remove user
  async remove(id: string): Promise<{ message: string }> {
    console.log('🗑️ Deleting user:', id);
    
    // Find and delete
    const result = await this.userModel.findByIdAndDelete(id).exec();
    
    if (!result) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    console.log('✅ User deleted');
    return { message: 'User deleted successfully' };
  }

  // Count all users
  async count(): Promise<number> {
    return this.userModel.countDocuments().exec();
  }
}