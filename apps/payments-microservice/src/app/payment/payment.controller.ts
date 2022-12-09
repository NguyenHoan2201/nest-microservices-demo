import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { MakePaymentDto } from "@microservices-demo/shared/dto";
import { kafkaTopics } from "@microservices-demo/shared/topics"
import { PaymentService } from "./payment.service";

@Controller()
export class PaymentController {

    constructor(private readonly paymentService: PaymentService) { }

    @EventPattern(kafkaTopics.processPayment)
    handleProcessPayment(@Payload() data: MakePaymentDto) {
        this.paymentService.processPayment(data);
    }
}
