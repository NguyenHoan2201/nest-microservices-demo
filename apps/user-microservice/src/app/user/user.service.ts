import {
    ConflictException,
    HttpException,
    HttpStatus,
    Injectable,
    Logger
} from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto } from '@microservices-demo/shared/dto';
import { User } from '@microservices-demo/shared/entities';
import { PostgresErrorCodes } from '@microservices-demo/shared/interfaces'

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) { }

    getData(): { message: string } {
        return { message: 'Welcome to user-microservice!' };
    }

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        try {
            const newUser = this.usersRepository.create(createUserDto);

            await this.usersRepository.save(newUser);

            return newUser;
        } catch (error) {
            Logger.error(error.message);
            if (error?.code === PostgresErrorCodes.UniqueViolation) {
                throw new ConflictException(
                    `User with ${createUserDto.email} already exists`
                );
            }
            throw new HttpException(
                error.message ?? "SOMETHING WENT WRONG",
                error.status ?? HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async getUser(id: string): Promise<User> {
        return await this.usersRepository.findOneBy({ id })
    }

    async getUserByEmail(email: string): Promise<User> {
        console.log('fetching user by email..........')
        return await this.usersRepository.findOneBy({ email })
    }
}
