import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateProductDto } from "@microservices-demo/shared/dto";
import { UpdateProductDto } from "@microservices-demo/shared/dto";
import { Product, ProductDocument } from "@microservices-demo/shared/schemas";

@Injectable()
export class ProductService {

  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<ProductDocument>
  ) { }

  create(createProductDto: CreateProductDto) {
    return 'This action adds a new product';
  }

  async findAll() {
    try {
      // return (await this.productModel.find({}, 'name description price stock').exec()).map(product => ({
      //   id: product._id._id,
      //   name: product.name,
      //   description: product.description,
      //   price: product.price,
      //   stock: product.stock
      // }));

      return (await this.productModel.find({}, 'name description price stock').exec())
    } catch (error) {
      Logger.error(JSON.stringify(error));
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
