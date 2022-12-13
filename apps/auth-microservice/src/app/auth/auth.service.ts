import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
// import { JwtService } from "@nestjs/jwt";
import { CreateUserDto, LoginUserDto, UpdateUserDto } from '@microservices-demo/shared/dto';
import { User } from '@microservices-demo/shared/entities';
import { PostgresErrorCodes } from '@microservices-demo/shared/interfaces';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>
        // private jwtService: JwtService,
    ) { }

    async validateUser(email: string, password: string): Promise<User> {
        try {

            const user = await this.userRepository.findOneBy({ email })

            if (user && await user.isValidPassword(password)) {
                console.log(
                    `login successful for: ${user.fullName}`
                );
                return user
            }

            throw new RpcException("Invalid Credentials");
        } catch (error) {
            Logger.error(JSON.stringify(error));
        }
    }

    async login(loginUserDto: LoginUserDto) {
        try {

            const { email, password } = loginUserDto;

            console.log('login user');

            const user = await this.userRepository.findOneBy({ email })

            if (user && user.isValidPassword(password)) {

                console.log(
                    user, '========', `login successful for: ${user.fullName}`
                );

                const payload = {
                    sub: user.id,
                    email: user.email,
                    name: user.fullName,
                };

                // return this.jwtService.sign(payload);

                return { ...payload }

            } else {
                throw new RpcException("Invalid Credentials")
            }

        } catch (error) {
            Logger.error(error)
        }
    }

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        try {
            const newUser = this.userRepository.create(createUserDto);

            await this.userRepository.save(newUser);

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
            const foundUser = await this.userRepository.findOneBy({ email });

            if (foundUser) {
                return foundUser;
            };

            throw new RpcException(`user with email: ${email} not found`);
        } catch (error) {
            Logger.error(error);
        }
    }

    async findOneById(id: string): Promise<Partial<User>> {
        try {
            const foundUser = await this.userRepository.findOne({
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
            await this.userRepository.update(id, updateUserDto);
        } catch (error) {
            Logger.error(error);
        }
    }

    async delete(id: string) {
        try {
            await this.userRepository.delete(id);
        } catch (error) {
            Logger.error(error);
        }
    }
}
