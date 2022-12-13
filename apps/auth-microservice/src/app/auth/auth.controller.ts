import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserDto, EntityIDDto, LoginUserDto } from '@microservices-demo/shared/dto';
import { kafkaTopics } from '@microservices-demo/shared/topics'
import { AuthService } from './auth.service';

@Controller()
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @MessagePattern(kafkaTopics.createUser)
    handleUserCreate(@Payload() data: CreateUserDto) {
        this.authService.createUser(data);
    }

    @MessagePattern(kafkaTopics.loginUser)
    handleLoginUser(@Payload() data: LoginUserDto) {
        this.authService.login(data);
    }

    @MessagePattern(kafkaTopics.getUserByID)
    handleGetUser(@Payload() userIDDto: EntityIDDto) {
        const { id } = userIDDto;
        return this.authService.findOneById(id);
    }
}
