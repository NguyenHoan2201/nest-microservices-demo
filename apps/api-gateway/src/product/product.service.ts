import {
  GatewayTimeoutException,
  Inject,
  Injectable,
  Logger,
  OnApplicationShutdown,
  OnModuleInit
} from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { lastValueFrom, timeout } from "rxjs";
import { kafkaTopics } from "@microservices-demo/shared/topics"
import { CreateProductDto } from "@microservices-demo/shared/dto";
import { UpdateProductDto } from "@microservices-demo/shared/dto";
import { Product } from "@microservices-demo/shared/schemas";

@Injectable()
export class ProductService implements OnModuleInit, OnApplicationShutdown {

  constructor(
    @Inject('PRODUCT_MICROSERVICE') private readonly productClient: ClientKafka
  ) { }

  async onModuleInit() {
    this.productClient.subscribeToResponseOf(kafkaTopics.getAllProducts);
    await this.productClient.connect()
  }

  async onApplicationShutdown() {
    await this.productClient.close()
  }

  create(createProductDto: CreateProductDto) {
    return 'This action adds a new product';
  }

  async findAll() {
    try {

      const allProducts = await lastValueFrom(
        this.productClient.send<Product[]>(kafkaTopics.getAllProducts, {}).pipe(timeout(30000))
      );

      return allProducts
    } catch (error) {
      Logger.error(error)
      throw new GatewayTimeoutException(error)
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
