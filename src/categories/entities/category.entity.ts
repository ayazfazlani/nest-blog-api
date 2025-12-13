// src/categories/entities/category.entity.ts
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
})
export class Category extends Document {
  @ApiProperty({ example: 'Technology' })
  @Prop({ required: true, unique: true, trim: true })
  name: string;

  @ApiProperty({ example: 'tech' })
  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  slug: string;

  @ApiProperty({ example: 'Technology related articles' })
  @Prop()
  description: string;

  @ApiProperty({ example: '#3B82F6' })
  @Prop({ default: '#3B82F6' })
  color: string;

  @ApiProperty()
  @Prop({ default: 0 })
  postCount: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
CategorySchema.index({ slug: 1 }, { unique: true });
CategorySchema.index({ name: 1 });