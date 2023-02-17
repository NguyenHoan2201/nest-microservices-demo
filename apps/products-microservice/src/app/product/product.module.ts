import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Product, ProductSchema } from "@microservices-demo/shared/schemas"
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";


@Module({
  imports: [MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }])],
  controllers: [ProductController],
  providers: [ProductService]
})
export class ProductModule { }
