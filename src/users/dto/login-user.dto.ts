import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ description: 'type Email, must be unique' })
  email: string;
  @IsNotEmpty()
  @ApiProperty({ description: 'required' })
  password: string;
}
