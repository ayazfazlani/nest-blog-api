// src/scripts/seed.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/users/users.service';
import { CategoriesService } from '../src/categories/categories.service';
import { PostsService } from '../src/posts/posts.service';
import { CreateUserDto } from '../src/users/dto/create-user.dto';
import { CreateCategoryDto } from '../src/categories/dto/create-category.dto';
import { CreatePostDto } from '../src/posts/dtos/create-post.dto';
import { UpdatePostDto } from '../src/posts/dtos/update-post.dto';
import { Post } from '../src/posts/entities/post.entity';
import { Category } from '../src/categories/entities/category.entity';
import { User } from '../src/users/entities/user.entity';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);
  const categoriesService = app.get(CategoriesService);
  const postsService = app.get(PostsService);
  const user = await usersService.findOne('666666666666666666666666');
  const category = await categoriesService.findOne('666666666666666666666666');
  const post = await postsService.findOne('666666666666666666666666');
  console.log(user);
  console.log(category);
  console.log(post);
} 
bootstrap();
