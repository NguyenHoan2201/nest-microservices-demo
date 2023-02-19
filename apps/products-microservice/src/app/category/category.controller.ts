import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "@microservices-demo/shared/dto";
import { UpdateCategoryDto } from "@microservices-demo/shared/dto";
import { kafkaTopics } from "@microservices-demo/shared/topics";

@Controller()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @MessagePattern('createCategory')
  create(@Payload() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @MessagePattern(kafkaTopics.getAllCategories)
  handleGetAllCategories() {
    return this.categoryService.findAll();
  }

  @MessagePattern('findOneCategory')
  findOne(@Payload() id: number) {
    return this.categoryService.findOne(id);
  }

  @MessagePattern('updateCategory')
  update(@Payload() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(updateCategoryDto.id, updateCategoryDto);
  }

  @MessagePattern('removeCategory')
  remove(@Payload() id: number) {
    return this.categoryService.remove(id);
  }
}
