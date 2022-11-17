import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '@microservices-demo/shared/dto'

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Post('register')
    createUser(@Body(ValidationPipe) createUserDto: CreateUserDto) {
        return this.authService.createUser(createUserDto);
    }
}
