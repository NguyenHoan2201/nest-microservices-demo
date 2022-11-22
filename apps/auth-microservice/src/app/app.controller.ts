import { LoginUserDto } from '@microservices-demo/shared/dto';
import { Controller, Get } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getData() {
    return this.appService.getData();
  }

  @EventPattern('login_user')
  handleLoginUser(@Payload() data: LoginUserDto) {
    this.appService.login(data);
  }
}
