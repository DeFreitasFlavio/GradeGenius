import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateItemDto {
  @ApiProperty({ description: 'Description of the item' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ description: 'Rating of the item' })
  @IsNotEmpty()
  @IsNumber()
  rating: number;

  @ApiProperty({ description: 'User ID' })
  @IsNotEmpty()
  @IsString()
  userID: string;
}
