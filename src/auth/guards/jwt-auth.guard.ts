import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly jwtService: JwtService) {
    super();
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1]; // Extract JWT token from Authorization header
    console.log(token);
    if (!token) {
      throw new UnauthorizedException('Missing authorization token');
    }

    try {
      const decodedToken = this.jwtService.verify(token); // Verify and decode JWT token
      req['user'] = decodedToken; // Attach user object to the request for further processing
      next();
    } catch (error) {
      throw new UnauthorizedException('Invalid authorization token');
    }
  }
}
