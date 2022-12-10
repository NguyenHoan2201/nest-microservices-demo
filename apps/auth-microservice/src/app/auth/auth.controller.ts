import { Controller, UseFilters } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { LoginUserDto } from '@microservices-demo/shared/dto';
import { kafkaTopics } from '@microservices-demo/shared/topics'
import { AuthService } from './auth.service';
import { ExceptionFilter } from '@microservices-demo/shared/filters';

@Controller()
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @UseFilters(new ExceptionFilter())
    @EventPattern(kafkaTopics.loginUser)
    handleLoginUser(@Payload() data: LoginUserDto) {
        this.authService.login(data);
    }
}
