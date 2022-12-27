import {
    Inject,
    Injectable,
    Logger,
    NotFoundException,
    OnModuleDestroy,
    OnModuleInit
} from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { MakePaymentDto } from "@microservices-demo/shared/dto";
import { User } from "@microservices-demo/shared/entities";
import { kafkaTopics } from "@microservices-demo/shared/topics"
import { lastValueFrom, timeout } from "rxjs";

@Injectable()
export class PaymentService implements OnModuleInit, OnModuleDestroy {
    constructor(
        @Inject('USER_MICROSERVICE') private readonly userClient: ClientKafka
    ) { }

    async onModuleInit() {
        this.userClient.subscribeToResponseOf(kafkaTopics.getUser);
        await this.userClient.connect()
    };

    async onModuleDestroy() {
        await this.userClient.close()
    }

    async processPayment(makePaymentDto: MakePaymentDto) {
        try {
            const { userId: id, amount } = makePaymentDto;

            console.log('process payment');

            const user = await lastValueFrom(
                this.userClient.send<User>(
                    kafkaTopics.getUser, { id }
                ).pipe(timeout(20000)));

            if (user) {
                console.log(
                    `process payment for user ${user.fullName} - amount: ${amount}`
                );

                return { status: 'success' }
            } else {
                throw new NotFoundException(`User with ID: ${id} not found`)
            }

        } catch (error) {
            Logger.error(error)
        }
    }
}
