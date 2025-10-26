import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UsePipes,
  Put,
  UseGuards,
} from '@nestjs/common';
import { MarcaService } from './marca.service';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';
import { NormalizePipe } from '../common/pipes/normalize.nombre.pipe';
import { ApiNoContentResponse, ApiOkResponse } from '@nestjs/swagger';
import { MarcaDto } from './dto/marca.dto';
import { AuthGuard, Roles } from '@thallesp/nestjs-better-auth';
import { Role } from '@prisma/client';

@UseGuards(AuthGuard)
@Controller('marca')
export class MarcaController {
  constructor(private readonly marcaService: MarcaService) {}

  @ApiOkResponse({ type: MarcaDto })
  @Post()
  @UsePipes(NormalizePipe)
  @Roles([Role.ADMIN])
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
  @Roles([Role.ADMIN])
  update(@Param('nombre') nombre: string, @Body() updateMarcaDto: UpdateMarcaDto) {
    return this.marcaService.update(nombre, updateMarcaDto);
  }

  @ApiNoContentResponse({ description: 'Marca eliminada' })
  @Delete(':nombre')
  @Roles([Role.ADMIN])
  remove(@Param('nombre') nombre: string) {
    return this.marcaService.softDelete(nombre);
  }
}
