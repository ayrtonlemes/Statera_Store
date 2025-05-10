import { IsEnum, IsNumber, IsOptional, Min } from 'class-validator';
import { OrderStatus } from '@prisma/client';

export class UpdateOrderDto {
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsOptional()
  @IsNumber()
  @Min(0)
  total?: number;
} 