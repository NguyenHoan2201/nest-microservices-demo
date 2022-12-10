import { Controller, Get, ParseIntPipe, UseFilters } from "@nestjs/common";
import { EventPattern, Payload, MessagePattern } from "@nestjs/microservices";
import { UserService } from "./user.service";
import { CreateUserDto } from "@microservices-demo/shared/dto";
import { kafkaTopics } from "@microservices-demo/shared/topics";
import { ExceptionFilter } from "@microservices-demo/shared/filters";

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) { }

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
    return this.userService.findOneById(userId);
  }

  @UseFilters(new ExceptionFilter())
  @MessagePattern(kafkaTopics.getUserByEmail)
  handleGetUserByEmail(@Payload('email') email: string) {
    return this.userService.findOneByEmail(email);
  }
}
