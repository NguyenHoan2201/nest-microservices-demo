import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { LoginUserDto } from '@microservices-demo/shared/dto';
import { kafkaTopics } from '@microservices-demo/shared/topics'
import { AuthService } from './auth.service';

@Controller()
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @EventPattern(kafkaTopics.loginUser)
    handleLoginUser(@Payload() data: LoginUserDto) {
        this.authService.login(data);
    }
}
