// src/categories/categories.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    // Generate slug from name
    const slug = this.generateSlug(createCategoryDto.name);
    
    // Check if slug exists
    const existingCategory = await this.categoryModel.findOne({ slug });
    if (existingCategory) {
      throw new ConflictException('Category already exists');
    }

    const category = await this.categoryModel.create({
      ...createCategoryDto,
      slug,
    });

    return category;
  }

  async findAll() {
    return this.categoryModel.find().sort({ name: 1 }).exec();
  }

  async findOne(slug: string) {
    const category = await this.categoryModel.findOne({ slug });
    
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async update(slug: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryModel.findOne({ slug });
    
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Update slug if name changed
    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      const newSlug = this.generateSlug(updateCategoryDto.name);
      
      // Check if new slug exists
      const existingCategory = await this.categoryModel.findOne({ 
        slug: newSlug, 
        _id: { $ne: category._id } 
      });
      
      if (!existingCategory) {
        updateCategoryDto['slug'] = newSlug;
      }
    }

    const updatedCategory = await this.categoryModel.findOneAndUpdate(
      { slug },
      { $set: updateCategoryDto },
      { new: true, runValidators: true },
    );

    return updatedCategory;
  }

  async remove(slug: string) {
    const category = await this.categoryModel.findOne({ slug });
    
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Check if category has posts
    // In real app, check Post model for references

    await category.deleteOne();
    return { message: 'Category deleted successfully' };
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  }
}