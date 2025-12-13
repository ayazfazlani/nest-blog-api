// src/posts/posts.controller.ts
import { 
    Controller, 
    Get, 
    Post, 
    Body, 
    Patch, 
    Param, 
    Delete, 
    Query, 
    UseGuards,
    Request,
    HttpCode,
    HttpStatus,
    ParseIntPipe,
    DefaultValuePipe,
  } from '@nestjs/common';
  import { 
    ApiTags, 
    ApiOperation, 
    ApiResponse, 
    ApiBearerAuth,
    ApiQuery,
  } from '@nestjs/swagger';
  import { PostsService } from './posts.service';
  import { CreatePostDto } from './dtos/create-post.dto';
  import { UpdatePostDto } from './dtos/update-post.dto';
  import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
  import { RolesGuard } from '../common/guards/roles.guard';
  import { Roles } from '../common/decorators/roles.decorator';
  import { PostStatus } from './entities/post.entity';
import { UserRole } from 'src/users/entities/user.entity';
  
  @ApiTags('Posts')
  @Controller('posts')
  export class PostsController {
    constructor(private readonly postsService: PostsService) {}
  
    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.AUTHOR)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new post' })
    @ApiResponse({ status: 201, description: 'Post created successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    async create(@Body() createPostDto: CreatePostDto, @Request() req) {
      return this.postsService.create(createPostDto);
    }
  
    @Get()
    @ApiOperation({ summary: 'Get all posts' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'status', required: false, enum: PostStatus })
    @ApiQuery({ name: 'category', required: false, type: String })
    @ApiQuery({ name: 'tag', required: false, type: String })
    @ApiQuery({ name: 'search', required: false, type: String })
    @ApiQuery({ name: 'featured', required: false, type: Boolean })
    async findAll(
      @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
      @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
      @Query('status') status?: PostStatus,
      @Query('category') category?: string,
      @Query('tag') tag?: string,
      @Query('search') search?: string,
      @Query('featured') featured?: boolean,
    ) {
      return this.postsService.find(
        page, 
        limit, 
        status || PostStatus.PUBLISHED, 
        category || '', 
        tag || '', 
        search || '', 
        featured || false,
      );
    }
  
    @Get(':slug')
    @ApiOperation({ summary: 'Get a post by slug' })
    @ApiResponse({ status: 200, description: 'Post found' })
    @ApiResponse({ status: 404, description: 'Post not found' })
    async findOne(@Param('slug') slug: string) {
      return this.postsService.findOne(slug);
    }
  
    @Patch(':slug')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.AUTHOR)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update a post' })
    @ApiResponse({ status: 200, description: 'Post updated successfully' })
    @ApiResponse({ status: 404, description: 'Post not found' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    async update(
      @Param('id') id: string,
      @Body() updatePostDto: UpdatePostDto,
      @Request() req,
    ) {
      return this.postsService.update(
        id,
        updatePostDto,
      );
    }
  
    @Delete(':slug')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.AUTHOR)
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete a post' })
    @ApiResponse({ status: 204, description: 'Post deleted successfully' })
    @ApiResponse({ status: 404, description: 'Post not found' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    async remove(@Param('slug') slug: string, @Request() req) {
      return this.postsService.remove(slug);
    }
  
    @Post(':slug/like')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Like a post' })
    async like(@Param('slug') slug: string, @Request() req) {
      return this.postsService.like(slug);
    }
  }