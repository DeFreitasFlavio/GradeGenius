import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forRoot('mongodb://mongodb:27017'), UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
