import { ClassSerializerInterceptor, Module } from "@nestjs/common";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { AllExceptionsFilter } from "@microservices-demo/shared/filters";
import { DataSource } from "typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "@microservices-demo/shared/entities";
import configuration from "./config/configuration";

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: '../.env',
      cache: true,
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get<string>("DB_HOST"),
        port: configService.get<number>("DB_PORT"),
        username: configService.get<string>("DB_USERNAME"),
        password: configService.get<string>("DB_PASSWORD"),
        database: configService.get<string>("DB_DATABASE"),
        entities: [User],
        migrations: ["dist/migrations/*.js"],
        migrationsTableName: "migrations_history",
        synchronize: true,
        ssl: {
          rejectUnauthorized: false,
        },
        connectTimeoutMS: 2000,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) { }
}
