import {
    HttpException,
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
        @Inject('AUTH_MICROSERVICE') private readonly authClient: ClientKafka,
        private jwtService: JwtService,
    ) { }

    async onModuleInit() {
        this.authClient.subscribeToResponseOf(kafkaTopics.createUser);
        this.authClient.subscribeToResponseOf(kafkaTopics.validateJwt);
        this.authClient.subscribeToResponseOf(kafkaTopics.validateUser);
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
                this.authClient.send<User>(
                    kafkaTopics.validateUser, { email, password }
                ).pipe(timeout(30000))
            );

            return user
        } catch (error) {
            Logger.error(error)
            throw new HttpException(error.message, 500)
        }
    };

    async validateJwt(sub: string) {
        try {
            const user = await lastValueFrom(
                this.authClient.send<User>(
                    kafkaTopics.validateJwt, { id: sub }
                ).pipe(timeout(30000))
            );

            if (user) {
                return user;
            }

            throw new UnauthorizedException("Invalid Credentials");
        } catch (error) {
            Logger.error(JSON.stringify(error));
        }
    }
}
