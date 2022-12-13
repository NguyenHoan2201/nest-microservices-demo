import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto, LoginUserDto } from "@microservices-demo/shared/dto"

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async createUser(@Body() createUserDto: CreateUserDto) {
        return await this.authService.createUser(createUserDto);
    }

    @Post('login')
    @HttpCode(200)
    async loginUser(@Body() loginUserDto: LoginUserDto) {
        return await this.authService.login(loginUserDto);
    }
}
