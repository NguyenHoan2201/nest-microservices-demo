import {
    HttpException,
    Inject,
    Injectable,
    Logger,
    OnApplicationShutdown,
    OnModuleInit
} from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { lastValueFrom, timeout } from "rxjs";
import { CreateUserDto, LoginUserDto } from "@microservices-demo/shared/dto";
import { kafkaTopics } from "@microservices-demo/shared/topics";
import { User } from "@microservices-demo/shared/entities";

@Injectable()
export class AuthService implements OnModuleInit, OnApplicationShutdown {
    constructor(
        @Inject('AUTH_MICROSERVICE') private readonly authClient: ClientKafka
    ) { }

    async onModuleInit() {
        this.authClient.subscribeToResponseOf(kafkaTopics.createUser);
        this.authClient.subscribeToResponseOf(kafkaTopics.loginUser);
        await this.authClient.connect()
    };

    async onApplicationShutdown() {
        await this.authClient.close()
    }

    async createUser(createUserDto: CreateUserDto) {
        try {
            const newUser = await lastValueFrom(
                this.authClient.send<User>(
                    kafkaTopics.createUser, { ...createUserDto }
                ).pipe(timeout(30000))
            );

            return newUser
        } catch (error) {
            Logger.error(error)
            throw new HttpException(error.message, 500)
        }

    }

    async login(loginUserDto: LoginUserDto) {
        try {
            const payload = await lastValueFrom(
                this.authClient.send<Record<string, string>>(
                    kafkaTopics.loginUser, { ...loginUserDto }
                ).pipe(timeout(30000))
            );

            return payload
        } catch (error) {
            Logger.error(error)
            throw new HttpException(error.message, 500)
        }
    }
}
