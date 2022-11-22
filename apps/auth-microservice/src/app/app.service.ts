import { Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto } from '@microservices-demo/shared/dto';
import { User } from '@microservices-demo/shared/entities';
import { ClientKafka } from '@nestjs/microservices';
import { timeout } from 'rxjs';

@Injectable()
export class AppService {

  constructor(@Inject('USER_MICROSERVICE') private readonly userClient: ClientKafka) { }

  getData(): { message: string } {
    return { message: 'Welcome to auth-microservice!' };
  }

  login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    console.log('login user');
    this.userClient
      .send('get_user_by_email', JSON.stringify({ email }))
      .pipe(timeout(20000)) // return an error if no response is recieved after 20 secs
      .subscribe((user: User) => {
        try {          
          if (user && user.password === password) {
            console.log(
              `login successful for: ${user.firstName + ' ' + user.lastName}`
            );
          } else {
            throw new UnauthorizedException('Invalid Credentials')
          }
          
        } catch (error) {
          Logger.error(error)
        }
      });
  }

  onModuleInit() {
    this.userClient.subscribeToResponseOf('get_user_by_email');
  }

}
