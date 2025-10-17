import { Cliente } from '@prisma/client';
import { CreateClienteDto } from '../dto/create-cliente.dto';

export function toClienteDto(cliente: Cliente): CreateClienteDto {
  const { email, nombre, apellido, telefono, cuil } = cliente;

  return {
    cuil: cuil,
    email: email,
    nombre: nombre,
    apellido: apellido,
    telefono: telefono ?? '',
  };
}
