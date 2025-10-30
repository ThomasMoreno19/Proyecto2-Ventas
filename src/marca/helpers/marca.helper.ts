import { Injectable, BadRequestException } from '@nestjs/common';
import { Marca } from '@prisma/client'; // Ajusta según tu modelo de Prisma
import { MarcaRepository } from '../repositories/marca.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMarcaDto } from '../dto/create-marca.dto';

@Injectable()
export class HelperMarca {
  constructor(private readonly marcaRepository: MarcaRepository) {}
  async canDelete(prisma: PrismaService, marcaId: string): Promise<boolean> {
    const productosCount = await prisma.product.count({
      where: { marcaXLinea: { is: { marcaId } } },
    });

    return productosCount === 0;
  }

  async reactivate(existingMarca: Marca, dto: CreateMarcaDto): Promise<Marca> {
    // Si la marca está eliminada (soft delete), reactivarla
    if (existingMarca.deletedAt !== null) {
      return await this.marcaRepository.reactivate(existingMarca, dto);
    }

    // Si no está eliminada, lanzar un error
    throw new BadRequestException(`Ya existe una marca con el nombre "${existingMarca.nombre}"`);
  }

  async findByMarcaXLineas(nombre: string) {
    const marca = await this.marcaRepository.findById(nombre);
    if (!marca) {
      throw new BadRequestException(`La marca con nombre "${nombre}" no existe.`);
    }
    const marcaXLineas = await this.marcaRepository.findMarcaXLineas(marca.id);
    return marcaXLineas;
  }
}
