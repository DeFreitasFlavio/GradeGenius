import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @ApiProperty({ description: 'required' })
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ description: 'type Email, must be unique' })
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty({ description: 'need 8 characters minimum' })
  password: string;

  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty({ description: 'required' })
  confirmpassword: string;
}
