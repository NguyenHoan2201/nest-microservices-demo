import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { LocalStrategy } from "./strategies/local.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_MICROSERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'auth',
            brokers: ['localhost:29092'],
          },
          consumer: {
            groupId: 'auth-consumer',
          },
        },
      },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        publicKey: configService.get<string>("accessToken.publicKey"),
        privateKey: {
          key: configService.get<string>("accessToken.privateKey"),
          passphrase: configService.get<string>("accessToken.secret"),
        },
        signOptions: {
          algorithm: "RS256",
          audience: "auth-microservice",
          expiresIn: "1h",
          issuer: "auth-microservice",
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy]
})
export class AuthModule { }