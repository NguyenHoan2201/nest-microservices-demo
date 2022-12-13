import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { MakePaymentDto } from "@microservices-demo/shared/dto";
import { kafkaTopics } from "@microservices-demo/shared/topics"
import { PaymentService } from "./payment.service";

@Controller()
export class PaymentController {

    constructor(private readonly paymentService: PaymentService) { }

    @MessagePattern(kafkaTopics.processPayment)
    async handleProcessPayment(@Payload() data: MakePaymentDto) {
        return await this.paymentService.processPayment(data);
    }
}
