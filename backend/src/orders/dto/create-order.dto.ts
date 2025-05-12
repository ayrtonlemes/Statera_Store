import { IsNumber, IsArray, ValidateNested, IsOptional, Min, IsString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethodType } from '@prisma/client';
class OrderItemDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  price: number;
}

export class CreateOrderDto {
  @IsNumber()
  clientId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  total?: number;

  // Campos exigidos pelo schema.prisma
  @IsString()
  shippingFirstName: string;

  @IsString()
  shippingLastName: string;

  @IsString()
  shippingAddress1: string;

  @IsString()
  shippingCity: string;

  @IsString()
  shippingZip: string;

  @IsString()
  shippingState: string;

  @IsString()
  shippingCountry: string;

  @IsEnum(PaymentMethodType)
  paymentMethodType: PaymentMethodType;
}
