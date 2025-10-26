import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UsePipes,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from './dto/product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { ValidateProductPipe } from './pipes/validate-product.pipe';
import { ValidateProductUpdatePipe } from './pipes/validate-productUpdate.pipe';
import { NormalizePipe } from '../common/pipes/normalize.nombre.pipe';
import { AuthGuard, Roles } from '@thallesp/nestjs-better-auth';
import { Role } from '@prisma/client';

@UseGuards(AuthGuard)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOkResponse({
    type: ProductDto,
    description: 'Producto creado exitosamente',
  })
  @Roles([Role.ADMIN])
  @Post()
  @UsePipes(ValidateProductPipe, NormalizePipe)
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
  @Roles([Role.ADMIN])
  @Put(':id')
  @UsePipes(NormalizePipe)
  update(
    @Param('id') id: string,
    @Body(ValidateProductUpdatePipe) updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(id, updateProductDto);
  }

  @ApiOkResponse({
    description: 'Producto eliminado exitosamente',
  })
  @Roles([Role.ADMIN])
  @Delete(':id')
  softDelete(@Param('id') id: string) {
    return this.productService.softDelete(id);
  }
}
