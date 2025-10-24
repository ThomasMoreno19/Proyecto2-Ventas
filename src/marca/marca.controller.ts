import { Controller, Get, Post, Body, Param, Delete, UsePipes, Put } from '@nestjs/common';
import { MarcaService } from './marca.service';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';
import { NormalizePipe } from '../common/pipes/normalize.nombre.pipe';
import { ApiNoContentResponse, ApiOkResponse } from '@nestjs/swagger';
import { MarcaDto } from './dto/marca.dto';

@Controller('marca')
export class MarcaController {
  constructor(private readonly marcaService: MarcaService) {}

  @ApiOkResponse({ type: MarcaDto })
  @Post()
  @UsePipes(NormalizePipe)
  create(@Body() createMarcaDto: CreateMarcaDto) {
    return this.marcaService.create(createMarcaDto);
  }

  @ApiOkResponse({ type: MarcaDto, isArray: true })
  @Get()
  findAll() {
    return this.marcaService.findAll();
  }

  @ApiOkResponse({ type: MarcaDto })
  @Get(':nombre')
  findOne(@Param('nombre') nombre: string) {
    return this.marcaService.findById(nombre);
  }

  @ApiOkResponse({ type: MarcaDto })
  @Put(':nombre')
  @UsePipes(NormalizePipe)
  update(@Param('nombre') nombre: string, @Body() updateMarcaDto: UpdateMarcaDto) {
    return this.marcaService.update(nombre, updateMarcaDto);
  }

  @ApiNoContentResponse({ description: 'Marca eliminada' })
  @Delete(':nombre')
  remove(@Param('nombre') nombre: string) {
    return this.marcaService.softDelete(nombre);
  }
}
