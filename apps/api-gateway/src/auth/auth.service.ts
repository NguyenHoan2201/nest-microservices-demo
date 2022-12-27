import {
    GatewayTimeoutException,
    Inject,
    Injectable,
    Logger,
    OnApplicationShutdown,
    OnModuleInit,
    UnauthorizedException
} from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { JwtService } from "@nestjs/jwt";
import { lastValueFrom, timeout } from "rxjs";
import { CreateUserDto } from "@microservices-demo/shared/dto";
import { kafkaTopics } from "@microservices-demo/shared/topics";
import { User } from "@microservices-demo/shared/entities";

@Injectable()
export class AuthService implements OnModuleInit, OnApplicationShutdown {
    constructor(
        @Inject('USER_MICROSERVICE') private readonly userClient: ClientKafka,
        private jwtService: JwtService,
    ) { }

    async onModuleInit() {
        this.userClient.subscribeToResponseOf(kafkaTopics.createUser);
        this.userClient.subscribeToResponseOf(kafkaTopics.getUser);
        this.userClient.subscribeToResponseOf(kafkaTopics.validateUser);
        await this.userClient.connect()
    };

    async onApplicationShutdown() {
        await this.userClient.close()
    }

    async createUser(createUserDto: CreateUserDto) {
        try {
            const newUser = await lastValueFrom(
                this.userClient.send<User>(
                    kafkaTopics.createUser, { ...createUserDto }
                ).pipe(timeout(20000))
            );

            return newUser
        } catch (error) {
            Logger.error(error)
            throw new GatewayTimeoutException(error)
        }
    }

    async login(user: User) {
        try {

            const payload = {
                sub: user.id,
                email: user.email,
                name: user.fullName,
                lastLogin: user.lastLogin,
                roles: user.roles
            };

            return this.jwtService.sign(payload);

        } catch (error) {
            Logger.error(error)
        }
    }

    async validateUser(email: string, password: string) {
        try {
            const user = await lastValueFrom(
                this.userClient.send<User>(
                    kafkaTopics.validateUser, { email, password }
                ).pipe(timeout(20000))
            );

            return user
        } catch (error) {
            Logger.error(error)
            throw new GatewayTimeoutException(error)
        }
    };

    async validateJwt(sub: string) {
        try {
            const user = await lastValueFrom(
                this.userClient.send<User>(
                    kafkaTopics.getUser, { id: sub }
                ).pipe(timeout(20000))
            );

            if (user) {
                return user;
            }

            throw new UnauthorizedException("Invalid Credentials");
        } catch (error) {
            Logger.error(JSON.stringify(error));
            throw new GatewayTimeoutException(error)
        }
    }
}
