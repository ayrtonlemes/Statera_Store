import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { OrdersModule } from './orders/orders.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UsersModule, OrdersModule, AuthModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {} 