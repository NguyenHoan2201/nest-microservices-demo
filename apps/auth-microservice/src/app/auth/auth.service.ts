import {
    Inject,
    Injectable,
    Logger,
    OnModuleInit,
    UnauthorizedException
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom, timeout } from 'rxjs';
// import { JwtService } from "@nestjs/jwt";
import { LoginUserDto } from '@microservices-demo/shared/dto';
import { User } from '@microservices-demo/shared/entities';
import { kafkaTopics } from '@microservices-demo/shared/topics';

@Injectable()
export class AuthService implements OnModuleInit {

    constructor(
        @Inject('USER_MICROSERVICE') private readonly userClient: ClientKafka,
        // private jwtService: JwtService,
    ) { }

    async validateUser(email: string, password: string): Promise<User> {
        try {

            const user: User = await lastValueFrom(
                this.userClient.send(kafkaTopics.getUserByEmail, JSON.stringify({ email })
                ).pipe(timeout(30000)));

            if (user && user.password === password) {
                console.log(
                    `login successful for: ${user.fullName}`
                );
                return user
            }

            throw new UnauthorizedException("Invalid Credentials");
        } catch (error) {
            Logger.error(JSON.stringify(error));
        }
    }

    async login(loginUserDto: LoginUserDto) {
        try {

            const { email, password } = loginUserDto;

            console.log('login user');

            const user: User = await lastValueFrom(
                this.userClient.send(kafkaTopics.getUserByEmail, JSON.stringify({ email })
                ).pipe(timeout(30000)));

            if (user && user.password === password) {
                console.log(
                    `login successful for: ${user.fullName}`
                );

                const payload = {
                    sub: user.id,
                    email: user.email,
                    name: user.fullName,
                };

                // return this.jwtService.sign(payload);

                return payload

            } else {
                throw new UnauthorizedException('Invalid Credentials')
            }

        } catch (error) {
            Logger.error(error)
        }
    }

    onModuleInit() {
        this.userClient.subscribeToResponseOf(kafkaTopics.getUserByEmail);
    }

}
