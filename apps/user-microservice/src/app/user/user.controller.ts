import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { CreateUserDto, EntityIDDto, LoginUserDto } from "@microservices-demo/shared/dto";
import { kafkaTopics } from "@microservices-demo/shared/topics"
import { UserService } from "./user.service";

@Controller()
export class UserController {

    constructor(private readonly userService: UserService) { }

    @MessagePattern(kafkaTopics.createUser)
    async handleUserCreate(@Payload() data: CreateUserDto) {
        return await this.userService.createUser(data);
    }

    @MessagePattern(kafkaTopics.getUser)
    async handleGetUser(@Payload() data: EntityIDDto) {
        return await this.userService.findOneById(data.id);
    }

    @MessagePattern(kafkaTopics.validateUser)
    async handleValidateUser(@Payload() data: LoginUserDto) {
        return await this.userService.validateUser(data);
    }
}
