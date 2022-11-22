import { CreateUserDto } from '@microservices-demo/shared/dto';
import { User } from '@microservices-demo/shared/entities';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from './user.repository';

@Injectable()
export class AppService {
  constructor(private readonly usersRepository: UsersRepository) { }
  
  getData(): { message: string } {
    return { message: 'Welcome to user-microservice!' };
  }

  createUser(data: CreateUserDto): void {
    this.usersRepository.save(data);
  }

  getUser(id: number): User {
    return this.usersRepository.findOne(id);
  }

  getUserByEmail(email: string): User {
    return this.usersRepository.findOneByEmail(email)
  }
}
