import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { LoginUserDto } from '@microservices-demo/shared/dto'
import { kafkaTopics } from '@microservices-demo/shared/topics'

@Injectable()
export class AuthService {
    constructor(@Inject('AUTH_MICROSERVICE') private readonly authClient: ClientKafka) { }

    login(loginUserDto: LoginUserDto) {
        try {
            this.authClient.emit(kafkaTopics.loginUser, JSON.stringify(loginUserDto));
        } catch (error) {
            throw new HttpException(error.message, 500)
        }
    }
}
