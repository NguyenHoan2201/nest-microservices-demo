import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_MICROSERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'payment-auth',
            brokers: ['localhost:29092'],
          },
          consumer: {
            groupId: 'payment-auth-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService]
})
export class PaymentModule { }
