import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: "$2y$10$YZM.npx0LPKqbmQjzWNTWeqX06MUkm6wtsS2jxdDtasWWXFzNhuES"
    });
  }

  async validate(payload: any) {
    return {customerUUID: payload.user_uuid}
  }
}
