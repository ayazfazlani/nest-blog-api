// src/categories/dto/create-category.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
    @ApiProperty({ example: 'Technology' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: false })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}