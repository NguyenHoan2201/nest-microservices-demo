import { Inject, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { MakePaymentDto } from '@microservices-demo/shared/dto';
import { User } from '@microservices-demo/shared/entities';
import { kafkaTopics } from '@microservices-demo/shared/topics'
import { lastValueFrom, timeout } from 'rxjs';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @Inject('USER_MICROSERVICE') private readonly userClient: ClientKafka
  ) { }

  getData(): { message: string } {
    return { message: 'Welcome to payments-microservice!' };
  }

  async processPayment(makePaymentDto: MakePaymentDto) {
    try {
      const { userId, amount } = makePaymentDto;

      console.log('process payment');

      const user: User = await lastValueFrom(
        this.userClient.send(kafkaTopics.getUserByID, JSON.stringify({ userId })
        ).pipe(timeout(30000)));

      if (user) {
        console.log(
          `process payment for user ${user.fullName} - amount: ${amount}`
        );
      } else {
        throw new NotFoundException(`User with ID: ${userId} not found`)
      }

    } catch (error) {
      Logger.error(error)
    }
  }

  onModuleInit() {
    this.userClient.subscribeToResponseOf(kafkaTopics.getUserByID);
  }
}
