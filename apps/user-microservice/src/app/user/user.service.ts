import { Injectable, Logger, } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
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
            if (error?.code === PostgresErrorCodes.UniqueViolation) {
                throw new RpcException(
                    `user with email: ${createUserDto.email} already exists`
                );
            }
            Logger.error(error);
        }
    }

    async findOneByEmail(email: string): Promise<User> {
        try {
            const foundUser = await this.usersRepository.findOneBy({ email });

            if (foundUser) {
                return foundUser;
            }

            throw new RpcException(`user with email: ${email} not found`);
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

            throw new RpcException(
                `user with id: ${id} not found`
            );
        } catch (error) {
            Logger.error(error);
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
