import { MakePaymentDto } from "@microservices-demo/shared/dto";
import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { SuccessResponse } from "../utils/successResponse";
import { PaymentService } from "./payment.service";

@Controller('payments')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) {}
    
    @Post('pay')
    @HttpCode(200)
    async makePayment(@Body() makePaymentDto: MakePaymentDto) {
        const data = await this.paymentService.makePayment(makePaymentDto);

        return new SuccessResponse(200, 'payment successful', data)
    }
}
