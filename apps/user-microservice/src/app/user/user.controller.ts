import { Controller, Get, ParseIntPipe } from '@nestjs/common';
import { EventPattern, Payload, MessagePattern } from '@nestjs/microservices';
import { UserService } from './user.service';
import { CreateUserDto } from '@microservices-demo/shared/dto';
import { kafkaTopics } from '@microservices-demo/shared/topics';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getData() {
    return this.userService.getData();
  }

  @EventPattern(kafkaTopics.createUser)
  handleUserCreate(@Payload() data: CreateUserDto) {
    this.userService.createUser(data);
  }

  @MessagePattern(kafkaTopics.getUserByID)
  handleGetUser(@Payload('userId', ParseIntPipe) userId: string) {
    return this.userService.getUser(userId);
  }

  @MessagePattern(kafkaTopics.getUserByEmail)
  handleGetUserByEmail(@Payload('email') email: string) {
    return this.userService.getUserByEmail(email);
  }
}
