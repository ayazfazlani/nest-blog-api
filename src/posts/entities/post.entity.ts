// src/posts/entities/post.entity.ts
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum PostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
})
export class Post extends Document {
  @ApiProperty({ example: 'Getting Started with NestJS' })
  @Prop({ required: true, trim: true })
  title: string;

  @ApiProperty({ example: 'getting-started-with-nestjs' })
  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  slug: string;

  @ApiProperty({ example: 'This is a short excerpt...' })
  @Prop({ required: true })
  excerpt: string;

  @ApiProperty({ example: '# This is the content' })
  @Prop({ required: true })
  content: string;

  @ApiProperty({ example: 'https://example.com/cover.jpg' })
  @Prop()
  coverImage: string;

  @ApiProperty({ enum: PostStatus, example: PostStatus.PUBLISHED })
  @Prop({
    type: String,
    enum: PostStatus,
    default: PostStatus.DRAFT,
  })
  status: PostStatus;

  @ApiProperty({ type: String })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  author: Types.ObjectId | User;

  @ApiProperty({ type: [String] })
  @Prop([{ type: Types.ObjectId, ref: 'Category' }])
  categories: Types.ObjectId[] | Category[];

  @ApiProperty({ example: ['nestjs', 'backend'] })
  @Prop([String])
  tags: string[];

  @ApiProperty()
  @Prop({ default: 0 })
  views: number;

  @ApiProperty()
  @Prop({ default: 0 })
  likes: number;

  @ApiProperty()
  @Prop({ default: 0 })
  commentCount: number;

  @ApiProperty()
  @Prop({ default: false })
  featured: boolean;

  @ApiProperty()
  @Prop()
  publishedAt: Date;

  @ApiProperty()
  @Prop()
  readingTime: number; // in minutes

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  // Virtual populate for comments
  @ApiProperty()
  comments: any[];
}

export const PostSchema = SchemaFactory.createForClass(Post);

// Indexes
PostSchema.index({ slug: 1 }, { unique: true });
PostSchema.index({ status: 1 });
PostSchema.index({ author: 1 });
PostSchema.index({ categories: 1 });
PostSchema.index({ tags: 1 });
PostSchema.index({ featured: 1 });
PostSchema.index({ publishedAt: -1 });
PostSchema.index({ 'title': 'text', 'content': 'text', 'excerpt': 'text' });

// Virtual for comments
PostSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'post',
});