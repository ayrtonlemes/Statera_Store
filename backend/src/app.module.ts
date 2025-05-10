import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { OrdersModule } from './orders/orders.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [OrdersModule, UsersModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {} 