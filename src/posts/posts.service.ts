// src/posts/posts.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { PostStatus } from './entities/post.entity';

@Injectable()
export class PostsService {
    constructor(
        @InjectModel(Post.name) private postModel: Model<Post>,
    ) {}

    async create(createPostDto: CreatePostDto): Promise<Post> {
        console.log('🔨 Creating post:', createPostDto.title);
        const newPost = new this.postModel(createPostDto);
        return newPost.save();
    }

    async find(page: number, limit: number, status: PostStatus, category: string, tag: string, search: string, featured: boolean): Promise<Post[]> {
        console.log('🔍 Finding all posts');
        const posts = await this.postModel.find().exec();
        return posts;
    }

    async findOne(id: string): Promise<Post> {
        console.log('🔍 Finding post with ID:', id);
        const post = await this.postModel.findById(id).exec();
        if (!post) {
            throw new NotFoundException(`Post with ID ${id} not found`);
        }
        return post;
    }

    async update(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
        console.log('🔄 Updating post:', id);
        const updatedPost = await this.postModel.findByIdAndUpdate(id, updatePostDto, { new: true }).exec();
        if (!updatedPost) {
            throw new NotFoundException(`Post with ID ${id} not found`);
        }
        return updatedPost;
    }

    async remove(id: string): Promise<void> {
        console.log('🗑️ Deleting post:', id);
        const result = await this.postModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`Post with ID ${id} not found`);
        }
        console.log('✅ Post deleted:', id);
    }

    async like(slug: string): Promise<void> {
        console.log('👍 Liking post:', slug);
        const post = await this.postModel.findOne({ slug }).exec();
        if (!post) {
            throw new NotFoundException(`Post with slug ${slug} not found`);
        }
        post.likes++;
        await post.save();
    }
    async count(): Promise<number> {
        return this.postModel.countDocuments().exec();
    }
}