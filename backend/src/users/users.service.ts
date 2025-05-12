import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

import { genSalt, hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const rounds = parseInt(process.env.BCRYPT_ROUNDS!);
    const salt = await genSalt(rounds);
    try {
      return await this.prisma.user.create({
        data: {
          ...createUserDto,
          password: await hash(createUserDto.password, salt),
        },
      });
    } catch (error) {
      if (error instanceof Error && 'code' in error) {
        if (error.code === 'P2002') {
          throw new ConflictException({
            statusCode: StatusCodes.CONFLICT,
            message: 'Email already exists',
            error: 'Conflict'
          });
  }
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.user.findMany({
      include: {
        orders: {
          include: {
            items: true
          }
        }
      }
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        orders: {
          include: {
            items: true
          }
        }
      }
    });

    if (!user) {
      throw new NotFoundException({
        statusCode: StatusCodes.NOT_FOUND,
        message: `User with ID ${id} not found`,
        error: 'Not Found'
      });
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const rounds = parseInt(process.env.BCRYPT_ROUNDS!);
    const salt = await genSalt(rounds);
    const password = await hash(updateUserDto.password, salt);
    try {
      return await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
      });
    } catch (error) {
      if (error instanceof Error && 'code' in error) {
        if (error.code === 'P2025') {
          throw new NotFoundException({
            statusCode: StatusCodes.NOT_FOUND,
            message: `User with ID ${id} not found`,
            error: 'Not Found'
          });
        }
        if (error.code === 'P2002') {
          throw new ConflictException({
            statusCode: StatusCodes.CONFLICT,
            message: 'Email already exists',
            error: 'Conflict'
          });
  }
      }
      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Error && 'code' in error) {
        if (error.code === 'P2025') {
          throw new NotFoundException({
            statusCode: StatusCodes.NOT_FOUND,
            message: `User with ID ${id} not found`,
            error: 'Not Found'
          });
        }
      }
      throw error;
    }
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
}
