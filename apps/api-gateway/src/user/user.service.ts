import { CreateUserDto } from '@microservices-demo/shared/dto';
import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { kafkaTopics } from '@microservices-demo/shared/topics'

@Injectable()
export class UserService {
    constructor(@Inject('USER_MICROSERVICE') private readonly userClient: ClientKafka) { }

    createUser(createUserDto: CreateUserDto) {
        this.userClient.emit(kafkaTopics.createUser, JSON.stringify(createUserDto));
    }
}
