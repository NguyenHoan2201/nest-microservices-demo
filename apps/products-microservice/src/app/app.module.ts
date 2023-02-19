import { ClassSerializerInterceptor, Module } from "@nestjs/common";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from '@nestjs/mongoose';
import { AllExceptionsFilter } from "@microservices-demo/shared/filters";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ProductModule } from "./product/product.module";
import { CategoryModule } from './category/category.module';
import configuration from "./config/configuration";

@Module({
  imports: [
    ProductModule,
    ConfigModule.forRoot({
      envFilePath: '../.env',
      cache: true,
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      useFactory:async (configService: ConfigService) => ({
        uri: configService.get<string>("database.uri"),
      }),
      inject: [ConfigService]
    }),
    CategoryModule
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
export class AppModule {}
