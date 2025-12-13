// src/users/dto/update-user.dto.ts
import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
    @ApiProperty({ example: 'John Doe' })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({ example: 'john@example.com' })
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiProperty({ example: 'password123' })
    @IsString()
    @IsOptional()
    password?: string;

}