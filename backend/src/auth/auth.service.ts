import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { compare } from 'bcrypt';
import { StatusCodes } from 'http-status-codes';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    
    if (!user) {
      throw new UnauthorizedException({
        statusCode: StatusCodes.UNAUTHORIZED,
        message: 'Invalid credentials',
        error: 'Unauthorized'
      });
    }

    const isPasswordValid = await compare(loginDto.password, user.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException({
        statusCode: StatusCodes.UNAUTHORIZED,
        message: 'Invalid credentials',
        error: 'Unauthorized'
      });
    }

    const payload = { sub: user.id, email: user.email };
    
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    };
  }
} 