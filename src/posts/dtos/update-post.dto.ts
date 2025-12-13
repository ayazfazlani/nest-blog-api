// src/posts/dtos/update-post.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsArray, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';
import { PostStatus } from '../entities/post.entity';

export class UpdatePostDto {
    @ApiProperty({ example: 'Getting Started with NestJS' })
    @IsString()
    @IsOptional()
    title?: string;
    @ApiProperty({ example: 'getting-started-with-nestjs' })
    @IsString()
    @IsOptional()
    slug?: string;
}

