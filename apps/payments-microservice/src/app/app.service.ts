import { Inject, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { MakePaymentDto } from '@microservices-demo/shared/dto';
import { User } from '@microservices-demo/shared/entities';
import { timeout } from 'rxjs';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @Inject('AUTH_MICROSERVICE') private readonly authClient: ClientKafka
  ) { }

  getData(): { message: string } {
    return { message: 'Welcome to payments-microservice!' };
  }

  processPayment(makePaymentDto: MakePaymentDto) {
    const { userId, amount } = makePaymentDto;
      console.log('process payment');
      this.authClient
        .send('get_user', JSON.stringify({ userId }))
        .pipe(timeout(20000)) // return an error if no response is recieved after 20 secs
        .subscribe((user: User) => {
          try {
            if (!user) throw new NotFoundException(`User with ID: ${userId} not found`)
          console.log(
            `process payment for user ${user.firstName + ' ' + user.lastName} - amount: ${amount}`
          );
          } catch (error) {
            Logger.error(error)
          }
        });
  }

  onModuleInit() {
    this.authClient.subscribeToResponseOf('get_user');
  }
}
