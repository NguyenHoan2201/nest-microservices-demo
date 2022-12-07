import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { MakePaymentDto } from '@microservices-demo/shared/dto';
import { kafkaTopics } from '@microservices-demo/shared/topics'

@Injectable()
export class PaymentService {
    constructor(
        @Inject('PAYMENT_MICROSERVICE') private readonly paymentClient: ClientKafka
    ) { }

    makePayment(makePaymentDto: MakePaymentDto) {
        this.paymentClient.emit(kafkaTopics.processPayment, JSON.stringify(makePaymentDto));
    }
}
