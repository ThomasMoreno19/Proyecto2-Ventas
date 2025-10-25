import { Controller, Get, Post, Body, Put, Param, Delete, UsePipes } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from './dto/product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { NormalizePipe } from 'src/common/pipes/normalize.nombre.pipe';
import { ApiOkResponse } from '@nestjs/swagger';
//import { AuthGuard, Roles } from '@thallesp/nestjs-better-auth';
//import { Role } from '@prisma/client';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOkResponse({
    type: ProductDto,
    description: 'Producto creado exitosamente',
  })
  //@UseGuards(AuthGuard)
  //@Roles([Role.ADMIN])
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
  //@UseGuards(AuthGuard)
  //@Roles([Role.ADMIN, Role.USER])
  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @ApiOkResponse({
    type: ProductDto,
    description: 'Producto obtenido exitosamente',
  })
  //@UseGuards(AuthGuard)
  //@Roles([Role.ADMIN, Role.USER])
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @ApiOkResponse({
    type: ProductDto,
    description: 'Producto actualizado exitosamente',
  })
  //@UseGuards(AuthGuard)
  //@Roles([Role.ADMIN])
  @Put(':id')
  @UsePipes(NormalizePipe)
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }
  @ApiOkResponse({
    description: 'Producto eliminado exitosamente',
  })
  //@UseGuards(AuthGuard)
  //@Roles([Role.ADMIN])
  @Delete(':id')
  softDelete(@Param('id') id: string) {
    return this.productService.softDelete(id);
  }
}
