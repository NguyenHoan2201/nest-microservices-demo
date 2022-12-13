import {
    Inject,
    Injectable,
    Logger,
    NotFoundException,
    OnModuleInit
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { MakePaymentDto } from '@microservices-demo/shared/dto';
import { User } from '@microservices-demo/shared/entities';
import { kafkaTopics } from '@microservices-demo/shared/topics'
import { lastValueFrom, timeout } from 'rxjs';

@Injectable()
export class PaymentService implements OnModuleInit {
    constructor(
        @Inject('AUTH_MICROSERVICE') private readonly authClient: ClientKafka
    ) { }

    onModuleInit() {
        this.authClient.subscribeToResponseOf(kafkaTopics.getUserByID);
    }

    async processPayment(makePaymentDto: MakePaymentDto) {
        try {
            const { userId: id, amount } = makePaymentDto;

            console.log('process payment');

            const user = await lastValueFrom(
                this.authClient.send<User>(
                    kafkaTopics.getUserByID, { id }
                ).pipe(timeout(30000)));

            if (user) {
                console.log(
                    `process payment for user ${user.fullName} - amount: ${amount}`
                );
            } else {
                throw new NotFoundException(`User with ID: ${id} not found`)
            }

        } catch (error) {
            Logger.error(error)
        }
    }
}
