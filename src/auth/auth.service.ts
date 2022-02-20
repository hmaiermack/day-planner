import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async getTokens(userId: number, email: string): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          expiresIn: 60 * 15,
          secret: 'access_token_secret',
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          expiresIn: 60 * 60 * 24 * 7,
          secret: 'refresh_token_secret',
        },
      ),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async updateRefreshTokenHash(userId: number, refreshToken: string) {
    const hash = await this.hashData(refreshToken);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRt: hash,
      },
    });
  }

  async signUpLocal(dto: AuthDto): Promise<Tokens> {
    const { email, password } = dto;

    const hash = await this.hashData(password);

    const newUser = await this.prisma.user.create({
      data: {
        email,
        hash,
      },
    });

    const tokens = await this.getTokens(newUser.id, newUser.email);

    await this.updateRefreshTokenHash(newUser.id, tokens.refresh_token);

    return tokens;
  }

  async signInLocal(dto: AuthDto): Promise<Tokens> {
    const { email, password } = dto;
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new ForbiddenException('Access denied.');
    }

    const passwordMatches = await bcrypt.compare(password, user.hash);

    if (!passwordMatches) {
      throw new ForbiddenException('Access denied.');
    }

    const tokens = await this.getTokens(user.id, user.email);

    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);

    return tokens;
  }

  logout() {}

  refreshTokens() {}
}
