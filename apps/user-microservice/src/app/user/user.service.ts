import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RpcException } from "@nestjs/microservices";
import { 
    CreateUserDto, 
    LoginUserDto, 
    UpdateUserDto 
} from "@microservices-demo/shared/dto";
import { User } from "@microservices-demo/shared/entities";
import { PostgresErrorCodes } from "@microservices-demo/shared/interfaces";

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ) { }

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
    
    async validateUser(loginUserDto: LoginUserDto): Promise<User> {
        try {

            const { email, password } = loginUserDto;

            const user = await this.userRepository.findOneBy({ email });

            if (user && await user.isValidPassword(password)) {
                user.lastLogin = new Date();
                await this.userRepository.save(user);
                return user
            }

            throw new RpcException("Invalid Credentials");
        } catch (error) {
            Logger.error(JSON.stringify(error));
        }
    }

    async findOneById(id: string): Promise<Partial<User>> {
        try {
            const foundUser = await this.userRepository.findOne({
                select: {
                    id: true,
                    email: true,
                    fullName: true,
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
