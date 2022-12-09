import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from '../config/configuration';
import { UserModule } from './user/user.module';
import { User } from '@microservices-demo/shared/entities';

@Module({
  imports: [
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
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) { }
}
