import {
    HttpException,
    Inject,
    Injectable,
    Logger,
    OnModuleInit
} from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { lastValueFrom, timeout } from "rxjs";
import { MakePaymentDto } from "@microservices-demo/shared/dto";
import { kafkaTopics } from "@microservices-demo/shared/topics"

@Injectable()
export class PaymentService implements OnModuleInit {
    constructor(
        @Inject('PAYMENT_MICROSERVICE') private readonly paymentClient: ClientKafka
    ) { }

    onModuleInit() {
        this.paymentClient.subscribeToResponseOf(kafkaTopics.processPayment)
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
