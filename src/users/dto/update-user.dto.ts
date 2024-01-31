import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ description: 'New name' })
  name: string;

  @ApiProperty({ description: 'New email' })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'Old PassWord' })
  oldPassword: string;

  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty({ description: 'New PassWord' })
  newPassword: string;

  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty({ description: 'confirm New PassWord' })
  confirmNewPassword: string;
}
