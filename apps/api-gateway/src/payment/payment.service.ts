import {
    HttpException,
    Inject,
    Injectable,
    Logger,
    OnApplicationShutdown,
    OnModuleInit
} from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { lastValueFrom, timeout } from "rxjs";
import { MakePaymentDto } from "@microservices-demo/shared/dto";
import { kafkaTopics } from "@microservices-demo/shared/topics"

@Injectable()
export class PaymentService implements OnModuleInit, OnApplicationShutdown {
    constructor(
        @Inject('PAYMENT_MICROSERVICE') private readonly paymentClient: ClientKafka
    ) { }

    async onModuleInit() {
        this.paymentClient.subscribeToResponseOf(kafkaTopics.processPayment);
        await this.paymentClient.connect()
    }

    async onApplicationShutdown() {
        await this.paymentClient.close()
    }

    async makePayment(makePaymentDto: MakePaymentDto) {
        try {
            const paymentStatus = await lastValueFrom(
                this.paymentClient.send<Record<string, string>>(
                    kafkaTopics.processPayment, { ...makePaymentDto }
                ).pipe(timeout(30000))
            );

            return paymentStatus

        } catch (error) {
            Logger.error(error)
            throw new HttpException(error.message, 500)
        }
    }
}
