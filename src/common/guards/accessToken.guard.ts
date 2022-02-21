import { AuthGuard } from '@nestjs/passport';

export class accessTokenGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
}
