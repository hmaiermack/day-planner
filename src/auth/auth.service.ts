import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import { Tokens } from './types';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async hashData(data: string) {
    try {
      const hash = await argon2.hash(data);
      return hash;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getTokens(userId: number): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId },
        {
          expiresIn: '15m',
          secret: 'access_token_secret',
        },
      ),
      this.jwtService.signAsync(
        { sub: userId },
        {
          expiresIn: '7d',
          secret: 'refresh_token_secret',
        },
      ),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async updateRefreshTokenHash(
    userId: number,
    refreshToken: string,
  ): Promise<void> {
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

    const tokens = await this.getTokens(newUser.id);

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

    const passwordMatches = await argon2.verify(user.hash, password);
    // const passwordMatches = await bcrypt.compare(password, user.hash);

    if (!passwordMatches) {
      throw new ForbiddenException('Access denied.');
    }

    const tokens = await this.getTokens(user.id);

    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async logout(userId: number): Promise<boolean> {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        hashedRt: {
          not: null,
        },
      },
      data: {
        hashedRt: null,
      },
    });

    return true;
  }

  async refreshTokens(userId: number, refreshToken: string): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new ForbiddenException('Access denied');
    }

    const rtMatch = await argon2.verify(user.hashedRt, refreshToken);

    if (!rtMatch) {
      throw new ForbiddenException('Access denied');
    }

    const tokens = await this.getTokens(user.id);

    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);

    return tokens;
  }
}
