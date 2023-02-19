import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { CategoryService } from "./category.service";
import { CategoryController } from "./category.controller";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PRODUCT_MICROSERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'product',
            brokers: ['localhost:29092'],
          },
          consumer: {
            groupId: 'product-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [CategoryController],
  providers: [CategoryService]
})
export class CategoryModule {}
