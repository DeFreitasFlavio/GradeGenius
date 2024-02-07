import {
  Request,
  Controller,
  Post,
  Get,
  Param,
  Body,
  Put,
  Delete,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateItemDto } from './dto/create-item.dto';
import { Item } from './schema/item.schema';
import { ItemService } from './item.service';
import { AuthService } from 'src/auth/auth.service';

@ApiTags('items')
@Controller('items')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class ItemController {
  constructor(
    private readonly itemService: ItemService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  async create(
    @Body() createItemDto: CreateItemDto,
    //  @Headers('authorization') authHeader: string,
  ): Promise<Item> {
    /* const token = authHeader.split(' ')[1];
    const decodedToken = this.authService.decodeJwt(token);
    const userId = decodedToken;
    console.log(userId); */
    return this.itemService.create(createItemDto);
  }

  @Get()
  async findAll(@Request() req: any): Promise<Item[]> {
    const userId = req.user.userId;
    return this.itemService.findAll(userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  async findItemByUserId(@Param('id') userId: string): Promise<Item> {
    const account = await this.itemService.findOne(userId);
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    return account;
  }

  @Get(':id/item')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  async findOne(@Param('id') userId: string): Promise<Item> {
    const account = await this.itemService.findOne(userId);
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    return account;
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  async update(
    @Body() updateItemDto: CreateItemDto,
    @Request() req: any,
  ): Promise<Item> {
    const userId = req.user.userId;
    return this.itemService.update(userId, updateItemDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  async deleteItem(
    @Param('itemId') itemId: string,
  ): Promise<{ success: boolean }> {
    const isDeleted = await this.itemService.deleteItemById(itemId);
    return { success: isDeleted };
  }
}
