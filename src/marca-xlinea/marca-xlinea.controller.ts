import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MarcaXlineaService } from './marca-xlinea.service';

@Controller('marca-xlinea')
export class MarcaXlineaController {
  constructor(private readonly marcaXlineaService: MarcaXlineaService) {}

  @Post()
  create() {
    return this.marcaXlineaService.create();
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
  update(@Param('id') id: string) {
    return this.marcaXlineaService.update(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.marcaXlineaService.remove(+id);
  }
}
