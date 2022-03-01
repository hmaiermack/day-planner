import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import { JwtPayload, Tokens } from './types';
import * as argon2 from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async signUpLocal(dto: AuthDto): Promise<Tokens> {
    const { email, password } = dto;

    const hash = await argon2.hash(password);

    const newUser = await this.prisma.user
      .create({
        data: {
          email,
          hash,
        },
      })
      .catch((e) => {
        if (e instanceof PrismaClientKnownRequestError) {
          if (e.code === 'P2002') {
            throw new ForbiddenException('Incorrect credentials');
          } else {
            throw e;
          }
        }
      });

    let tokens;

    if (newUser) {
      tokens = await this.getTokens(newUser?.id);

      await this.updateRefreshTokenHash(newUser?.id, tokens.refresh_token);
    }

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

    console.log({ passwordMatches });

    if (!passwordMatches) {
      throw new ForbiddenException('Access denied.');
    }

    const tokens = await this.getTokens(user.id);

    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);

    console.log({ user });

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

  async getTokens(userId: number): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: userId,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        expiresIn: '15m',
        secret: process.env.AT_SECRET,
      }),
      this.jwtService.signAsync(jwtPayload, {
        expiresIn: '7d',
        secret: process.env.RT_SECRET,
      }),
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
    const hash = await argon2.hash(refreshToken);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRt: hash,
      },
    });
  }

  async refreshTokens(userId: number, refreshToken: string): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user || !user.hashedRt) {
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
