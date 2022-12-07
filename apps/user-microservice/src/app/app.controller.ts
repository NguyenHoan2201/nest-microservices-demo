import { Controller, Get, ParseIntPipe } from '@nestjs/common';
import { EventPattern, Payload, MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';
import { CreateUserDto } from '@microservices-demo/shared/dto';
import { kafkaTopics } from '@microservices-demo/shared/topics';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @EventPattern(kafkaTopics.createUser)
  handleUserCreate(@Payload() data: CreateUserDto) {
    this.appService.createUser(data);
  }

  @MessagePattern(kafkaTopics.getUserByID)
  handleGetUser(@Payload('userId', ParseIntPipe) userId: number) {
    return this.appService.getUser(userId);
  }

  @MessagePattern(kafkaTopics.getUserByEmail)
  handleGetUserByEmail(@Payload('email') email: string) {
    return this.appService.getUserByEmail(email);
  }
}
