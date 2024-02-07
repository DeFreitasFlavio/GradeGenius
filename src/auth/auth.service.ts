import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Users } from 'src/users/schemas/users.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  decodeJwt(token: string): string {
    try {
      const decoded = this.jwtService.decode(token);
      return decoded.id;
      if (typeof decoded === 'object' && decoded.hasOwnProperty('userId')) {
        return decoded['userId'];
      } else {
        throw new UnauthorizedException('Invalid token');
      }
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async validateUser(email: string, pass: string): Promise<Users> {
    const user = await this.usersService.findOneByEmail(email);
    /* if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    if (!(await bcrypt.compare(pass, user.password))) {
      throw new UnauthorizedException('Password is incorrect');
    } */
    if (user && bcrypt.compareSync(pass, user.password)) {
      const { password, ...result } = user;
      console.log(result);
      return user;
    }
    return null;
  }

  async login(use: any) {
    const user = await this.validateUser(use.email, use.password);
    if (!user) {
      throw new HttpException('Account does not exist', HttpStatus.FORBIDDEN);
    }
    const payload = { id: user.userID };
    console.log(payload);
    console.log({
      access_token: this.jwtService.sign(payload),
      token_type: 'Bearer',
    });
    return {
      access_token: this.jwtService.sign(payload),
      token_type: 'Bearer',
    };
  }

  async generateJwtToken(userId: string): Promise<{ access_token: string }> {
    const payload = { userId }; // Include user ID in the payload
    return { access_token: this.jwtService.sign(payload) };
  }
}
