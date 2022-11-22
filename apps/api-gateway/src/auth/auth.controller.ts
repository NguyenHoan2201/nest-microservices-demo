import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '@microservices-demo/shared/dto'

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @HttpCode(200)
    loginUser(@Body() loginUserDto: LoginUserDto) {
        return this.authService.login(loginUserDto);
    }
}
