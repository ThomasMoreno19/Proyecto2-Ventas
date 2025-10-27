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
import { LineaService } from './linea.service';
import { CreateLineaDto } from './dto/create-linea.dto';
import { UpdateLineaDto } from './dto/update-linea.dto';
import { NormalizePipe } from '../common/pipes/normalize.nombre.pipe';
import {
  ApiNoContentResponse,
  ApiOkResponse,
} from '@nestjs/swagger/dist/decorators/api-response.decorator';
import { LineaDto } from './dto/linea.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthGuard, Roles } from '@thallesp/nestjs-better-auth';
import { Role } from '@prisma/client';

@ApiTags('lineas')
@Controller('linea')
@UseGuards(AuthGuard)
export class LineaController {
  constructor(private readonly lineaService: LineaService) {}

  @ApiOkResponse({ type: LineaDto })
  @ApiBody({ type: CreateLineaDto })
  @Post()
  @UsePipes(NormalizePipe)
  @Roles([Role.ADMIN])
  create(@Body() createLineaDto: CreateLineaDto) {
    return this.lineaService.create(createLineaDto);
  }

  @ApiOkResponse({ type: LineaDto, isArray: true })
  @Get()
  findAll() {
    return this.lineaService.findAll();
  }

  @ApiOkResponse({ type: LineaDto })
  @Get(':nombre')
  findOne(@Param('nombre') nombre: string) {
    return this.lineaService.findById(nombre);
  }

  @ApiOkResponse({ type: LineaDto })
  @Put(':nombre')
  @UsePipes(NormalizePipe)
  @Roles([Role.ADMIN])
  update(@Param('nombre') nombre: string, @Body() updateLineaDto: UpdateLineaDto) {
    return this.lineaService.update(nombre, updateLineaDto);
  }

  @ApiNoContentResponse({ description: 'Linea eliminada' })
  @Delete(':nombre')
  @Roles([Role.ADMIN])
  remove(@Param('nombre') nombre: string) {
    return this.lineaService.softDelete(nombre);
  }

  @Get(':nombre/marcas')
  async getMarcasPorLinea(@Param('nombre') nombre: string) {
    return this.lineaService.getMarcasPorLinea(nombre);
  }
}
