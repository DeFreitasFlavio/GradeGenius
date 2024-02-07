import { Module, forwardRef } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ItemModule } from './item/item.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { FakerDataService } from './faker-data.service';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    ThrottlerModule.forRoot([
      {
        ttl: 600000000,
        limit: 1,
      },
    ]),
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    UsersModule,
    ItemModule,
  ],
  controllers: [],
  providers: [
    // FakerDataService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
