import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Prisma, Order } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const {
      clientId,
      items,
      total,
      shippingFirstName,
      shippingLastName,
      shippingAddress1,
      shippingCity,
      shippingState,
      shippingZip,
      shippingCountry,
      paymentMethodType,
    } = createOrderDto;
  
    const calculatedTotal = total || items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
    return this.prisma.order.create({
      data: {
        total: calculatedTotal,
        shippingFirstName,
        shippingLastName,
        shippingAddress1,
        shippingCity,
        shippingZip,
        shippingState,
        shippingCountry,
        paymentMethodType,
        client: {
          connect: { id: clientId },
        },
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: true,
        client: true,
      },
    });
  }
  
  async findAll(): Promise<Order[]> {
    return this.prisma.order.findMany({
      include: {
        items: true,
        client: true,
      },
    });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        client: true,
      },
    });

    if (!order) {
      throw new NotFoundException({
        statusCode: StatusCodes.NOT_FOUND,
        message: `Order with ID ${id} not found`,
        error: 'Not Found'
      });
    }

    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);

    return this.prisma.order.update({
      where: { id },
      data: updateOrderDto,
      include: {
        items: true,
        client: true,
      },
    });
  }

  async remove(id: number): Promise<Order> {
    const order = await this.findOne(id);

    await this.prisma.orderItem.deleteMany({
      where: { orderId: id },
    });

    return this.prisma.order.delete({
      where: { id },
    });
  }
} 