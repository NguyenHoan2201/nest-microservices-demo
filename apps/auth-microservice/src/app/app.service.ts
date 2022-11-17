import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '@microservices-demo/shared/dto';
import { User } from '@microservices-demo/shared/entities';
import { UsersRepository } from './user.repository';

@Injectable()
export class AppService {

  constructor(private readonly usersRepository: UsersRepository) { }

  getData(): { message: string } {
    return { message: 'Welcome to auth-microservice!' };
  }

  createUser(data: CreateUserDto): void {
    this.usersRepository.save(data);
  }

  getUser(id: number): User {
    return this.usersRepository.findOne(id);
  }

}
