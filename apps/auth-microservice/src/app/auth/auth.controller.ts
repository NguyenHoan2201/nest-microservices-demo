import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { CreateUserDto, EntityIDDto, LoginUserDto } from "@microservices-demo/shared/dto";
import { kafkaTopics } from "@microservices-demo/shared/topics"
import { AuthService } from "./auth.service";

@Controller()
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @MessagePattern(kafkaTopics.createUser)
    async handleUserCreate(@Payload() data: CreateUserDto) {
        return await this.authService.createUser(data);
    }

    @MessagePattern(kafkaTopics.loginUser)
    async handleLoginUser(@Payload() data: LoginUserDto) {
        return await this.authService.login(data);
    }

    @MessagePattern(kafkaTopics.getUserByID)
    async handleGetUser(@Payload() userIDDto: EntityIDDto) {
        const { id } = userIDDto;
        return await this.authService.findOneById(id);
    }
}
