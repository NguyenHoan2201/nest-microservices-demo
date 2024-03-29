import { Body, Controller, HttpCode, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "@microservices-demo/shared/dto"
import { SkipAuth } from "./decorators/skip-auth.decorator";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { User } from "@microservices-demo/shared/entities";
import { UserDecorator } from "./decorators/user.decorator";
import { SuccessResponse } from "../utils/successResponse";

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async createUser(@Body() createUserDto: CreateUserDto) {
        return await this.authService.createUser(createUserDto);
    }

    @Post('login')
    @HttpCode(200)
    @SkipAuth()
    @UseGuards(LocalAuthGuard)
    async loginUser(@UserDecorator() user: User,
        // @Res({ passthrough: true }) res: Response
    ) {
        const token = await this.authService.login(user);

        return new SuccessResponse(200, 'login successful', token)
    }
}
