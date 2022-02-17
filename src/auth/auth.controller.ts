import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  //local: username/password auth, not implementing third party signup eg google
  @Post('/local/signup')
  signUpLocal() {
    this.authService.signUpLocal();
  }

  @Post('/local/signin')
  signInLocal() {
    this.authService.signInLocal();
  }

  @Post('/logout')
  logout() {
    this.authService.logout();
  }

  @Post('/refresh')
  refreshTokens() {
    this.authService.refreshTokens();
  }
}
