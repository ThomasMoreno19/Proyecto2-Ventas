import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MarcaXlineaService } from './marca-xlinea.service';
import { CreateMarcaXlineaDto } from './dto/create-marca-xlinea.dto';
import { UpdateMarcaXlineaDto } from './dto/update-marca-xlinea.dto';

@Controller('marca-xlinea')
export class MarcaXlineaController {
  constructor(private readonly marcaXlineaService: MarcaXlineaService) {}

  @Post()
  create(@Body() createMarcaXlineaDto: CreateMarcaXlineaDto) {
    return this.marcaXlineaService.create(createMarcaXlineaDto);
  }

  @Get()
  findAll() {
    return this.marcaXlineaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.marcaXlineaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMarcaXlineaDto: UpdateMarcaXlineaDto) {
    return this.marcaXlineaService.update(+id, updateMarcaXlineaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.marcaXlineaService.remove(+id);
  }
}
