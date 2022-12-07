import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { UsersRepository } from './database/user.repository';
import { CreateUserDto } from '@microservices-demo/shared/dto';
import { User } from '@microservices-demo/shared/entities';

@Injectable()
export class AppService {
  constructor(private readonly usersRepository: UsersRepository) { }

  getData(): { message: string } {
    return { message: 'Welcome to user-microservice!' };
  }

  createUser(data: CreateUserDto): string {
    try {
      const userExists = this.usersRepository.findOneBy({ email: data.email })

      if (userExists) {
        throw new ConflictException(`User with email: ${data.email} already exists`)
      }

      this.usersRepository.save(data);

      return 'user created'
    } catch (error) {
      Logger.error(error)
    }
  }

  getUser(id: number): User {
    return this.usersRepository.findOne(id);
  }

  getUserByEmail(email: string): User {
    return this.usersRepository.findOneBy({ email })
  }
}
