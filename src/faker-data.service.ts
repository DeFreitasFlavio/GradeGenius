// faker-data.service.ts
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { faker } from '@faker-js/faker';
import { Users } from './users/schemas/users.schema';

@Injectable()
export class FakerDataService implements OnApplicationBootstrap {
  constructor(@InjectModel(Users.name) private userModel: Model<Users>) {}

  async onApplicationBootstrap(): Promise<Users[]> {
    const users = [];
    for (let i = 0; i < 10; i++) {
      const randomName = faker.person.fullName();
      const randomEmail = faker.internet.email();
      const randomPassword = faker.internet.password({ length: 10 });
      const hashedPassword = randomPassword;
      const user = new this.userModel({
        userID: new mongoose.Types.ObjectId(),
        name: randomName,
        email: randomEmail,
        password: hashedPassword,
      });
      users.push(await user.save());
    }
    return users;
  }
}
