import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, Put } from '@nestjs/common';
import { MarcaService } from './marca.service';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';
import { NormalizePipe } from 'src/common/pipes/normalize.nombre.pipe';

@Controller('marca')
export class MarcaController {
  constructor(private readonly marcaService: MarcaService) {}

  @Post()
  @UsePipes(NormalizePipe)
  create(@Body() createMarcaDto: CreateMarcaDto) {
    return this.marcaService.create(createMarcaDto);
  }

  @Get()
  findAll() {
    return this.marcaService.findAll();
  }

  @Get(':nombre')
  findOne(@Param('nombre') nombre: string) {
    return this.marcaService.findById(nombre);
  }

  @Put(':nombre')
  @UsePipes(NormalizePipe)
  update(@Param('nombre') nombre: string, @Body() updateMarcaDto: UpdateMarcaDto) {
    return this.marcaService.update(nombre, updateMarcaDto);
  }

  @Delete(':nombre')
  remove(@Param('nombre') nombre: string) {
    return this.marcaService.softDelete(nombre);
  }
}
