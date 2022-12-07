import {
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
  UnauthorizedException
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom, timeout } from 'rxjs';
// import { JwtService } from "@nestjs/jwt";
import { LoginUserDto } from '@microservices-demo/shared/dto';
import { User } from '@microservices-demo/shared/entities';
import { kafkaTopics } from '@microservices-demo/shared/topics';

@Injectable()
export class AppService implements OnModuleInit {

  constructor(
    @Inject('USER_MICROSERVICE') private readonly userClient: ClientKafka,
    // private jwtService: JwtService,
  ) { }

  getData(): { message: string } {
    return { message: 'Welcome to auth-microservice!' };
  }

  async login(loginUserDto: LoginUserDto) {
    try {

      const { email, password } = loginUserDto;

      console.log('login user');

      const user: User = await lastValueFrom(
        this.userClient.send(kafkaTopics.getUserByEmail, JSON.stringify({ email })
        ).pipe(timeout(30000)));

      if (user && user.password === password) {
        console.log(
          `login successful for: ${user.firstName + ' ' + user.lastName}`
        );

        const payload = {
          sub: user.id,
          email: user.email,
          name: user.firstName + " " + user.lastName,
        };

        // return this.jwtService.sign(payload);

        return payload

      } else {
        throw new UnauthorizedException('Invalid Credentials')
      }

    } catch (error) {
      Logger.error(error)
    }
  }

  onModuleInit() {
    this.userClient.subscribeToResponseOf(kafkaTopics.getUserByEmail);
  }

}
