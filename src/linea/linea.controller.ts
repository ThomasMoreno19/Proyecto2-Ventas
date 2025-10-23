import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UsePipes,
  Put,
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

@Controller('linea')
export class LineaController {
  constructor(private readonly lineaService: LineaService) {}

  @ApiOkResponse({ type: LineaDto })
  @Post()
  @UsePipes(NormalizePipe)
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
  update(
    @Param('nombre') nombre: string,
    @Body() updateLineaDto: UpdateLineaDto,
  ) {
    return this.lineaService.update(nombre, updateLineaDto);
  }

  @ApiNoContentResponse({ description: 'Linea eliminada' })
  @Delete(':nombre')
  remove(@Param('nombre') nombre: string) {
    return this.lineaService.softDelete(nombre);
  }
}
