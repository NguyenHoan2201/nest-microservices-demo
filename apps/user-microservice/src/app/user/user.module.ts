import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from '@microservices-demo/shared/entities';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService],
  controllers: [UserController]
})
export class UserModule { }
