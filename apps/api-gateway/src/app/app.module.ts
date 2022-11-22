import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PaymentModule } from '../payment/payment.module';
import { UserModule } from '../user/user.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [AuthModule, PaymentModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
