import { Controller, Get, Post, Body, Param, Delete, UsePipes, Put } from '@nestjs/common';
import { LineaService } from './linea.service';
import { CreateLineaDto } from './dto/create-linea.dto';
import { UpdateLineaDto } from './dto/update-linea.dto';
import { NormalizePipe } from 'src/common/pipes/normalize.nombre.pipe';

@Controller('linea')
export class LineaController {
  constructor(private readonly lineaService: LineaService) {}

  @Post()
  @UsePipes(NormalizePipe)
  create(@Body() createLineaDto: CreateLineaDto) {
    return this.lineaService.create(createLineaDto);
  }

  @Get()
  findAll() {
    return this.lineaService.findAll();
  }

  @Get(':nombre')
  findOne(@Param('nombre') nombre: string) {
    return this.lineaService.findById(nombre);
  }

  @Put(':nombre')
  @UsePipes(NormalizePipe)
  update(@Param('nombre') nombre: string, @Body() updateLineaDto: UpdateLineaDto) {
    return this.lineaService.update(nombre, updateLineaDto);
  }

  @Delete(':nombre')
  remove(@Param('nombre') nombre: string) {
    return this.lineaService.softDelete(nombre);
  }
}
