import { MakePaymentDto } from '@microservices-demo/shared/dto';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payments')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) {}
    
    @Post('pay')
    @HttpCode(200)
    makePayment(@Body() makePaymentDto: MakePaymentDto) {
        return this.paymentService.makePayment(makePaymentDto);
    }
}
