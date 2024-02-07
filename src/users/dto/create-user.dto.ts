import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @ApiProperty({ description: 'Required', example: 'John Doe' })
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: 'Email address (must be unique)',
    example: 'john@example.com',
  })
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty({
    description: 'Password (minimum 8 characters)',
    example: 'password123',
  })
  password: string;

  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty({
    description: 'Confirm password (must match password)',
    example: 'password123',
  })
  confirmPassword: string;
}
