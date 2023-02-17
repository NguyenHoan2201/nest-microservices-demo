import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { ProductService } from "./product.service";
import { CreateProductDto } from "@microservices-demo/shared/dto";
import { UpdateProductDto } from "@microservices-demo/shared/dto";
import { SuccessResponse } from "../utils/successResponse";

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  async findAll() {
    
    const data = await this.productService.findAll();

    return new SuccessResponse(200, 'all products', data)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
