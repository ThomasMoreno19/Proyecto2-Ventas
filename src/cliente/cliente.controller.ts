import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  UsePipes,
  Put,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { ClienteService } from './cliente.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { NormalizePipe } from '../common/pipes/normalize.nombre.pipe';
import { ValidateCuilPipe } from './pipe/normalize-cuil.pipe';
import { ValidateTelefonoPipe } from './pipe/normalize-telefono.pipe';
import { ValidateEmailPipe } from './pipe/normalize-email.pipe';
import { ValidateUpdateClientePipe } from './pipe/update-dto.pipe';
import { AuthGuard } from '@thallesp/nestjs-better-auth';

@ApiTags('Cliente')
@Controller('cliente')
@UseGuards(AuthGuard)
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @Post()
  @UsePipes(NormalizePipe)
  @ApiOperation({ summary: 'Crea un nuevo cliente' })
  @ApiBody({ type: CreateClienteDto, description: 'Datos del nuevo cliente' })
  @ApiResponse({ status: 201, description: 'Cliente creado correctamente.' })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o nombre duplicado.',
  })
  create(
    @Body('email', ValidateEmailPipe) email: string,
    @Body('telefono', ValidateTelefonoPipe) telefono: string,
    @Body('cuil', ValidateCuilPipe) cuil: string,
    @Body() createClienteDto: CreateClienteDto,
  ) {
    createClienteDto.email = email;
    createClienteDto.telefono = telefono;
    createClienteDto.cuil = cuil;
    return this.clienteService.create(createClienteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtiene todos los clientes registrados' })
  @ApiResponse({
    status: 200,
    description: 'Listado de clientes retornado correctamente.',
  })
  findAll() {
    return this.clienteService.findAll();
  }

  @Get(':cuil')
  @ApiOperation({ summary: 'Obtiene un cliente por su CUIL' })
  @ApiParam({
    name: 'cuil',
    description: 'CUIL del cliente',
    example: '20345678901',
  })
  @ApiResponse({ status: 200, description: 'Cliente encontrado.' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado.' })
  findOne(@Body('cuil', ValidateCuilPipe) cuil: string) {
    return this.clienteService.findById(cuil);
  }

  @Put(':cuil')
  @UsePipes(NormalizePipe)
  @ApiOperation({ summary: 'Actualiza los datos de un cliente existente' })
  @ApiParam({
    name: 'cuil',
    description: 'CUIL del cliente a actualizar',
    example: '20345678901',
  })
  @ApiBody({
    type: UpdateClienteDto,
    description: 'Datos actualizados del cliente',
  })
  @ApiResponse({
    status: 200,
    description: 'Cliente actualizado correctamente.',
  })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado.' })
  update(
    @Param('cuil') cuil: string,
    @Body(ValidateUpdateClientePipe) updateClienteDto: UpdateClienteDto,
  ) {
    updateClienteDto.cuil = cuil;
    return this.clienteService.update(updateClienteDto);
  }

  @Delete(':cuil')
  @ApiOperation({ summary: 'Elimina lógicamente un cliente' })
  @ApiParam({
    name: 'cuil',
    description: 'CUIL del cliente a eliminar',
    example: '20345678901',
  })
  @ApiResponse({ status: 200, description: 'Cliente eliminado correctamente.' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado.' })
  remove(@Param('cuil', ValidateCuilPipe) cuil: string) {
    return this.clienteService.softDelete(cuil);
  }
}
