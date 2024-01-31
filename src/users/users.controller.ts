import {
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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { AccountJWT } from './models/users.model';

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

  @ApiOperation({
    summary: 'Update user',
  })
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
      user.password,
      jwt.access_token,
    );
    return jwtAccount;
  }

  @ApiOperation({
    summary: 'Register a user',
    description: 'He take 3 params user, email and password',
  })
  @Post('register')
  @UsePipes(ValidationPipe)
  async register(@Body() body: CreateUserDto): Promise<AccountJWT> {
    body.email = body.email.toLowerCase();
    await this.usersService.findOneByEmail(body.email);
    if (body.password != body.confirmpassword) {
      throw new BadRequestException('Passwords do not match');
    }
    const user = await this.usersService.createUser(body);
    console.log(user);
    const jwt = await this.authService.register(user.userID);
    const jwtAccount = new AccountJWT(
      user.userID,
      user.name,
      user.email,
      user.password,
      jwt.access_token,
    );
    return jwtAccount;
  }
}
