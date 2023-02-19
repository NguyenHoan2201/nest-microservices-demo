import { 
  GatewayTimeoutException,
  Inject, 
  Injectable, 
  Logger, 
  OnApplicationShutdown, 
  OnModuleInit 
} from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { kafkaTopics } from "@microservices-demo/shared/topics";
import { CreateCategoryDto } from "@microservices-demo/shared/dto";
import { UpdateCategoryDto } from "@microservices-demo/shared/dto";
import { Category } from "@microservices-demo/shared/schemas";
import { lastValueFrom, timeout } from "rxjs";

@Injectable()
export class CategoryService implements OnModuleInit, OnApplicationShutdown {
  
  constructor(
    @Inject('PRODUCT_MICROSERVICE') private readonly categoryClient: ClientKafka
  ) { }

  async onModuleInit() {
    this.categoryClient.subscribeToResponseOf(kafkaTopics.getAllCategories);
    await this.categoryClient.connect()
  }

  async onApplicationShutdown() {
    await this.categoryClient.close()
  }
  
  create(createCategoryDto: CreateCategoryDto) {
    return 'This action adds a new category';
  }

  async findAll() {
    try {

      const allCategories = await lastValueFrom(
        this.categoryClient.send<Category[]>(kafkaTopics.getAllCategories, {}).pipe(timeout(30000))
      );

      return allCategories
    } catch (error) {
      Logger.error(error)
      throw new GatewayTimeoutException(error)
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
