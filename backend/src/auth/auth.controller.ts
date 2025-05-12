import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { StatusCodes } from 'http-status-codes';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(StatusCodes.OK)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
} 