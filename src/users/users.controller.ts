import {
  Request,
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UsePipes,
  ValidationPipe,
  BadRequestException,
  HttpException,
  HttpStatus,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { Account, AccountJWT } from './models/users.model';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Throttle } from '@nestjs/throttler';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({
    summary: 'Get all users',
  })
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiOperation({
    summary: 'Delete user',
  })
  @Delete(':userId')
  async deleteUser(
    @Param('userId') userId: string,
  ): Promise<{ success: boolean }> {
    const isDeleted = await this.usersService.deleteUserById(userId);
    return { success: isDeleted };
  }

  @Get('account')
  @UseGuards(JwtAuthGuard)
  async myAccount(@Request() req: any) {
    const user = await this.usersService.findByUserId(req.user.id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return new Account(user.userID, user.name, user.email);
  }

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Get(':id/account')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  async getAccountById(@Param('id') userId: string) {
    const account = await this.usersService.findByUserId(userId);
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    return account;
  }

  @ApiOperation({
    summary: 'Update user',
  })
  @UseGuards(JwtAuthGuard)
  @Put(':userId')
  async updateUser(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<{ success: boolean }> {
    const isUpdated = await this.usersService.updateUserById(
      userId,
      updateUserDto,
    );
    return { success: isUpdated };
  }

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('login')
  @UsePipes(ValidationPipe)
  async login(@Body() body: LoginDto): Promise<AccountJWT> {
    body.email = body.email.toLowerCase();
    const user = await this.usersService.findOneByEmail(body.email);
    if (!user) {
      throw new HttpException('Account does not exist', HttpStatus.FORBIDDEN);
    }
    //send info to login service and return user with jwt
    const jwt = await this.authService.login(body);
    const jwtAccount = new AccountJWT(
      user.userID,
      user.name,
      user.email,
      jwt.access_token,
    );
    return jwtAccount;
  }

  @ApiOperation({
    summary: 'Register a user',
    description: 'Register a new user with email and password',
  })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully registered.',
    type: AccountJWT,
  })
  @Post('register')
  @UsePipes(ValidationPipe)
  async register(@Body() body: CreateUserDto): Promise<AccountJWT> {
    body.email = body.email.toLowerCase();
    await this.usersService.findOneByEmail(body.email);

    if (body.password !== body.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const user = await this.usersService.createUser(body);
    console.log(user);

    const jwt = await this.authService.generateJwtToken(user.userID);

    const jwtAccount = new AccountJWT(
      user.userID,
      user.name,
      user.email,
      jwt.access_token,
    );

    return jwtAccount;
  }
}
