// src/categories/dto/update-category.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoryDto {
    @ApiProperty({ example: 'Technology' })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({ example: false })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}