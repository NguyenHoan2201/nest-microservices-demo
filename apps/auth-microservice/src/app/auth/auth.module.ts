import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { User } from "@microservices-demo/shared/entities";

@Module({
  imports: [
    TypeOrmModule.forFeature([User])
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule { }
