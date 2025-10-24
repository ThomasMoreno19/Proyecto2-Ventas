import { Controller, Get, Post, Body, Put, Param, Delete, UsePipes } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from './dto/product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { NormalizePipe } from 'src/common/pipes/normalize.nombre.pipe';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOkResponse({
    type: ProductDto,
    description: 'Producto creado exitosamente',
  })
  @Post()
  @UsePipes(NormalizePipe)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @ApiOkResponse({
    type: ProductDto,
    isArray: true,
    description: 'Productos obtenidos exitosamente',
  })
  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @ApiOkResponse({
    type: ProductDto,
    description: 'Producto obtenido exitosamente',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @ApiOkResponse({
    type: ProductDto,
    description: 'Producto actualizado exitosamente',
  })
  @Put(':id')
  @UsePipes(NormalizePipe)
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @ApiOkResponse({
    description: 'Producto eliminado exitosamente',
  })
  @Delete(':id')
  softDelete(@Param('id') id: string) {
    return this.productService.softDelete(id);
  }
}
