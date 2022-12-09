import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AppService } from "../app.service";
import { User } from "@microservices-demo/shared/entities";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private appService: AppService) {
    super({ usernameField: "email" });
  }

  async validate(email: string, password: string): Promise<User> {
    const user = await this.appService.validateUser(email, password);

    if (user) return user;

    throw new UnauthorizedException();
  }
}