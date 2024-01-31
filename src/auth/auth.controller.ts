import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../users/dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    // Perform authentication logic here, e.g., verify credentials

    // If authentication successful, generate JWT token
    const token = await this.authService.login({
      email: loginDto.email,
      password: loginDto.password,
    });
    return { token };
  }
}
