import {
    ConflictException,
    HttpException,
    HttpStatus,
    Injectable,
    Logger,
    NotFoundException,
    UnauthorizedException
} from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto, UpdateUserDto } from "@microservices-demo/shared/dto";
import { User } from "@microservices-demo/shared/entities";
import { PostgresErrorCodes } from "@microservices-demo/shared/interfaces"

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
            Logger.error(error);
            if (error?.code === PostgresErrorCodes.UniqueViolation) {
                throw new ConflictException(
                    `User with ${createUserDto.email} already exists`
                );
            }
        }
    }

    async findOneByEmail(email: string): Promise<User> {
        try {
            const foundUser = await this.usersRepository.findOneBy({ email });

            if (foundUser) {
                return foundUser;
            }

            throw new UnauthorizedException("Invalid Credentials");
        } catch (error) {
            Logger.error(error);
        }
    }

    async findOneById(id: string): Promise<Partial<User>> {
        try {
            const foundUser = await this.usersRepository.findOne({
                select: {
                    id: true,
                    email: true,
                    lastLogin: true,
                    roles: true,
                },
                where: { id },
            });

            if (foundUser) {
                return foundUser;
            }

            throw new NotFoundException(
                `User with id: ${id} does not exist on this server`
            );
        } catch (error) {
            Logger.error(error.message);
        }
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        try {
            await this.usersRepository.update(id, updateUserDto);
        } catch (error) {
            Logger.error(error);
        }
    }

    async delete(id: string) {
        try {
            await this.usersRepository.delete(id);
        } catch (error) {
            Logger.error(error);
        }
    }
}
