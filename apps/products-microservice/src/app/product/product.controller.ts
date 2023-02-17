import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { ProductService } from "./product.service";
import { CreateProductDto } from "@microservices-demo/shared/dto";
import { UpdateProductDto } from "@microservices-demo/shared/dto";
import { kafkaTopics } from "@microservices-demo/shared/topics"

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @MessagePattern('createProduct')
  handleCreateProduct(@Payload() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @MessagePattern(kafkaTopics.getAllProducts)
  handleGetAllProducts() {
    return this.productService.findAll();
  }

  @MessagePattern('findOneProduct')
  handleGetProduct(@Payload() id: number) {
    return this.productService.findOne(id);
  }

  @MessagePattern('updateProduct')
  handleUpdateProduct(@Payload() updateProductDto: UpdateProductDto) {
    return this.productService.update(updateProductDto.id, updateProductDto);
  }

  @MessagePattern('removeProduct')
  handleDeleteProduct(@Payload() id: number) {
    return this.productService.remove(id);
  }
}
