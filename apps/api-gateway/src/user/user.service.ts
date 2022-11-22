import { CreateUserDto } from '@microservices-demo/shared/dto';
import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class UserService {
    constructor(@Inject('USER_MICROSERVICE') private readonly userClient: ClientKafka) { }

    createUser(createUserDto: CreateUserDto) {
        this.userClient.emit('create_user', JSON.stringify(createUserDto));
    }
}
