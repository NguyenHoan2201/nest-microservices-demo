import { CreateUserDto } from '@microservices-demo/shared/dto';
import { Controller, Get, ParseIntPipe } from '@nestjs/common';
import { EventPattern, Payload, MessagePattern } from '@nestjs/microservices';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @EventPattern('create_user')
  handleUserCreate(@Payload() data: CreateUserDto) {
    this.appService.createUser(data);
  }

  @MessagePattern('get_user_by_id')
  handleGetUser(@Payload('userId', ParseIntPipe) userId: number) {
    return this.appService.getUser(userId);
  }

  @MessagePattern('get_user_by_email')
  handleGetUserByEmail(@Payload('email') email: string) {
    return this.appService.getUserByEmail(email);
  }
}
