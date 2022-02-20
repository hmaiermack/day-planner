import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  signUpLocal(dto: AuthDto) {
    //   const newUser = this.prisma.user.create({
    //       data: {
    //           email: dto.email
    //       }
    //   })

    const { email, password } = dto;

    this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  signInLocal() {}

  logout() {}

  refreshTokens() {}
}
