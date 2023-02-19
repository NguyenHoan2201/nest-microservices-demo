import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateCategoryDto } from "@microservices-demo/shared/dto";
import { UpdateCategoryDto } from "@microservices-demo/shared/dto";
import { Category, CategoryDocument } from "@microservices-demo/shared/schemas";


@Injectable()
export class CategoryService {

  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<CategoryDocument>
  ) { }

  create(createCategoryDto: CreateCategoryDto) {
    return 'This action adds a new category';
  }

  async findAll() {
    try {
      return await this.categoryModel.find({}).exec()
    } catch (error) {
      Logger.error(JSON.stringify(error));
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
