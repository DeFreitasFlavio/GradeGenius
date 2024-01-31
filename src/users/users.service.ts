import { UpdateUserDto } from './dto/update-user.dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Users } from './schemas/users.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(Users.name) private userModel: Model<Users>) {}

  async findByUserId(userId: string): Promise<Users> {
    const user = await this.userModel.findOne({ userID: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findOneByEmail(email: string): Promise<Users> {
    const user = await this.userModel.findOne({ email: email });
    return user;
  }

  async createUser(body: CreateUserDto): Promise<Users> {
    const hashedPassword = await bcrypt.hash(body.password, 10);
    // Generate a id
    const userID = new mongoose.Types.ObjectId();
    // Create a new user instance
    const newUser = new this.userModel({
      userID: userID,
      name: body.name,
      email: body.email,
      password: hashedPassword, // Store hashed password
    });

    // Save the new user
    const result = await newUser.save();
    return result;
  }

  async findAll(): Promise<Users[]> {
    return this.userModel.find().exec();
  }

  async deleteUserById(userId: string): Promise<boolean> {
    const result = await this.userModel.deleteOne({ userID: userId }).exec();
    return result.deletedCount > 0;
  }

  async updateUserById(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<boolean> {
    // Check if new password matches confirm new password
    if (updateUserDto.newPassword !== updateUserDto.confirmNewPassword) {
      throw new BadRequestException(
        'New password and confirm new password do not match',
      );
    }

    // Retrieve the user by userId
    const user = await this.userModel.findOne({ userID: userId }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!(await bcrypt.compare(updateUserDto.oldPassword, user.password))) {
      throw new UnauthorizedException('Old password is incorrect');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(updateUserDto.newPassword, 10);

    // Update the user details
    user.name = updateUserDto.name;
    user.email = updateUserDto.email;
    user.password = hashedPassword;

    // Save the updated user
    const result = await user.save();
    return !!result;
  }
}
