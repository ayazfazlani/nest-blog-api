// src/categories/categories.controller.ts
import { 
    Controller, 
    Get, 
    Post, 
    Body, 
    Patch, 
    Param, 
    Delete, 
    UseGuards,
  } from '@nestjs/common';
  import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
  import { CategoriesService } from './categories.service';
  import { CreateCategoryDto } from './dto/create-category.dto';
  import { UpdateCategoryDto } from './dto/update-category.dto';
  import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
  import { RolesGuard } from '../common/guards/roles.guard';
  import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

  @ApiTags('Categories')
  @Controller('categories')
  export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}
  
    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new category' })
    @ApiResponse({ status: 201, description: 'Category created successfully' })
    async create(@Body() createCategoryDto: CreateCategoryDto) {
      return this.categoriesService.create(createCategoryDto);
    }
  
    @Get()
    @ApiOperation({ summary: 'Get all categories' })
    async findAll() {
      return this.categoriesService.findAll();
    }
  
    @Get(':slug')
    @ApiOperation({ summary: 'Get a category by slug' })
    @ApiResponse({ status: 200, description: 'Category found' })
    @ApiResponse({ status: 404, description: 'Category not found' })
    async findOne(@Param('slug') slug: string) {
      return this.categoriesService.findOne(slug);
    }
  
    @Patch(':slug')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update a category' })
    async update(
      @Param('slug') slug: string,
      @Body() updateCategoryDto: UpdateCategoryDto,
    ) {
      return this.categoriesService.update(slug, updateCategoryDto);
    }
  
    @Delete(':slug')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete a category' })
    async remove(@Param('slug') slug: string) {
      return this.categoriesService.remove(slug);
    }
  }