import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { LoginUserDto } from '@microservices-demo/shared/dto'
import { kafkaTopics } from '@microservices-demo/shared/topics'

@Injectable()
export class AuthService {
    constructor(@Inject('AUTH_MICROSERVICE') private readonly authClient: ClientKafka) { }

    login(loginUserDto: LoginUserDto) {
        this.authClient.emit(kafkaTopics.loginUser, JSON.stringify(loginUserDto));
    }
}
