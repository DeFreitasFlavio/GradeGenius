import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    /* if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    if (!(await bcrypt.compare(pass, user.password))) {
      throw new UnauthorizedException('Password is incorrect');
    } */
    if (user && bcrypt.compareSync(pass, user.password)) {
      const { password, ...result } = user;
      console.log(password);
      return result;
    }
    return null;
  }

  async login(use: any) {
    const user = await this.validateUser(use.email, use.password);
    if (!user) {
      throw new HttpException('Account does not exist', HttpStatus.FORBIDDEN);
    }
    const payload = { id: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      token_type: ' Bearer',
    };
  }

  async register(id: string) {
    const payload = { id: id };
    return {
      access_token: this.jwtService.sign(payload),
      token_type: ' Bearer',
    };
  }
}
