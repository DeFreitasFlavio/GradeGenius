import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Item } from './schema/item.schema';
import { CreateItemDto } from './dto/create-item.dto';

@Injectable()
export class ItemService {
  constructor(
    @InjectModel(Item.name) private readonly itemModel: Model<Item>,
  ) {}

  async create(body: CreateItemDto): Promise<Item> {
    const newItem = new this.itemModel({
      userID: body.userID,
      description: body.description,
      rating: body.rating,
    });
    console.log(newItem);
    return newItem.save();
  }

  async findAll(userId: string): Promise<Item[]> {
    return this.itemModel.find({ userId }).exec();
  }

  async findItemByUserId(userId: string): Promise<Item> {
    const user = await this.itemModel.findOne({ userID: userId });
    if (!user) {
      console.log(user);
      throw new NotFoundException('User not found');
    }
    console.log(user);
    return user;
  }

  async findOne(userId: string): Promise<Item> {
    const item = await this.itemModel.findOne({ id: userId }).exec();
    if (!item) {
      throw new NotFoundException('Item not found');
    }
    return item;
  }

  async update(userId: string, updateItemDto: CreateItemDto): Promise<Item> {
    const existingItem = await this.findOne(userId);
    existingItem.description = updateItemDto.description;
    existingItem.rating = updateItemDto.rating;
    return existingItem.save();
  }

  async deleteItemById(itemId: string): Promise<boolean> {
    const result = await this.itemModel.deleteOne({ itemID: itemId }).exec();
    return result.deletedCount > 0;
  }
}
