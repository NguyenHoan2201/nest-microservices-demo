import {
  CacheInterceptor,
  CacheModule,
  ClassSerializerInterceptor,
  Module
} from "@nestjs/common";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { RedisClientOptions } from "redis";
import * as redisStore from "cache-manager-redis-store";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "../auth/auth.module";
import { PaymentModule } from "../payment/payment.module";
import { ProductModule } from "../product/product.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import configuration from "./config/configuration";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env',
      cache: true,
      isGlobal: true,
      load: [configuration],
    }),
    CacheModule.registerAsync<RedisClientOptions>({
      isGlobal: true,
      useFactory: async (configService: ConfigService) => ({
        ttl: 300,
        max: 1000,

        store: typeof redisStore,
        url: configService.get<string>("redis.hostUrl"),
        username: configService.get<string>("redis.username"),
        password: configService.get<string>("redis.password"),
        name: configService.get<string>("redis.dbname"),
      }),
      inject: [ConfigService],
    }),

    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    AuthModule,
    PaymentModule,
    ProductModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule { }
