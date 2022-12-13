import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { MakePaymentDto } from '@microservices-demo/shared/dto';
import { kafkaTopics } from '@microservices-demo/shared/topics'

@Injectable()
export class PaymentService {
    constructor(
        @Inject('PAYMENT_MICROSERVICE') private readonly paymentClient: ClientKafka
    ) { }

    makePayment(makePaymentDto: MakePaymentDto) {
        try {
            this.paymentClient.emit(kafkaTopics.processPayment, { ...makePaymentDto });
        } catch (error) {
            Logger.error(error)
            throw new HttpException(error.message, 500)
        }
    }
}
