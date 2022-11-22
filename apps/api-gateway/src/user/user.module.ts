import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_MICROSERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'user',
            brokers: ['localhost:9092'],
          },
          producerOnlyMode: true,
          consumer: {
            groupId: 'user-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
