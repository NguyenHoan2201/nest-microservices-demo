import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { SuccessResponse } from "../utils/successResponse";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "@microservices-demo/shared/dto";
import { UpdateCategoryDto } from "@microservices-demo/shared/dto";

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  async findAll() {
    const data = await this.categoryService.findAll();

    return new SuccessResponse(200, 'all categories', data)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
