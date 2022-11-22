import { CreateUserDto } from '@microservices-demo/shared/dto';
import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post('register')
    createUser(@Body() createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto);
    }
}
