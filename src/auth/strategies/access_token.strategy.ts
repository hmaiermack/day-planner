import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

//if you wanted jwt to store more than just an id you can add it to this type and alter getTokens helper function in authService and all calls of getTokens
//possible refactoring opportunity so you just have to change getTokens definition and not subsequent calls?
type JwtPayload = {
  id: string;
  //username: string;
  //etc
};

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'access_token_secret',
    });
  }

  validate(payload: JwtPayload) {
    return payload;
  }
}
