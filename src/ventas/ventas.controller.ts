import { Controller, Get, Post, Body, Put, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { VentasService } from './ventas.service';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { Type } from 'class-transformer';
import { AuthGuard, type UserSession, Session } from '@thallesp/nestjs-better-auth';

class FindAllQuery {
  @Type(() => Number)
  skip?: number;

  @Type(() => Number)
  take?: number;

  usuarioId?: string;

  @Type(() => Date)
  from?: Date;

  @Type(() => Date)
  to?: Date;
}

@UseGuards(AuthGuard)
@Controller('ventas')
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  @Post()
  create(@Body() dto: CreateVentaDto, @Session() session: UserSession) {
    return this.ventasService.create(dto, session);
  }

  @Get()
  findAll(@Query() q: FindAllQuery, @Session() session: UserSession, to?: Date, from?: Date) {
    return this.ventasService.findAll(session, to, from, q);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ventasService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateVentaDto, @Session() session: UserSession) {
    return this.ventasService.update(id, dto, session);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ventasService.remove(id);
  }
}
