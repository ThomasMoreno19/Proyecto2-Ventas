import { Test, TestingModule } from '@nestjs/testing';
import { MarcaService } from './marca.service';
import { MarcaRepository } from './repositories/marca.repository';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';
import { MarcaDto } from './dto/marca.dto';
import { toMarcaDto } from './mappers/marca.mapper';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import * as checkHelper from '../common/helpers/check.nombre.helper';
import * as productoHelper from './helpers/check.producto';

describe('MarcaService', () => {
  let service: MarcaService;
  let repository: { [K in keyof MarcaRepository]: jest.Mock };
  let prisma: { [key: string]: any };

  beforeEach(async () => {
    repository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
    };

    prisma = {
      marca: { findMany: jest.fn() },
      product: { count: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarcaService,
        { provide: MarcaRepository, useValue: repository },
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(MarcaService);

    jest.spyOn(checkHelper, 'checkUniqueName').mockImplementation(jest.fn());
    jest.spyOn(productoHelper, 'canDelete').mockImplementation(jest.fn());
  });

  const marcaMock = {
    id: '1',
    nombre: 'Marca1',
    descripcion: 'Desc',
    logo: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  it('should return all marcas', async () => {
    repository.findAll.mockResolvedValue([marcaMock]);
    const result: MarcaDto[] = [toMarcaDto(marcaMock)];

    await expect(service.findAll()).resolves.toEqual(result);
  });

  it('should return a MarcaDto if found', async () => {
    repository.findById.mockResolvedValue(marcaMock);
    const result: MarcaDto = toMarcaDto(marcaMock);

    await expect(service.findById('Marca1')).resolves.toEqual(result);
  });

  it('should throw NotFoundException if not found', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(service.findById('Marca1')).rejects.toThrow(NotFoundException);
  });

  it('should create a new marca', async () => {
    const dto: CreateMarcaDto = { nombre: 'Marca1', descripcion: 'Desc' };
    repository.create.mockResolvedValue(marcaMock);
    const result: MarcaDto = toMarcaDto(marcaMock);

    await expect(service.create(dto)).resolves.toEqual(result);
    expect(checkHelper.checkUniqueName).toHaveBeenCalled();
    expect(repository.create).toHaveBeenCalled();
  });

  it('should update a marca', async () => {
    const dto: UpdateMarcaDto = { nombre: 'Marca1', descripcion: 'Desc' };
    repository.update.mockResolvedValue(marcaMock);
    const result: MarcaDto = toMarcaDto(marcaMock);

    await expect(service.update('Marca1', dto)).resolves.toEqual(result);
    expect(repository.update).toHaveBeenCalled();
  });

  it('should softDelete a marca if canDelete returns true', async () => {
    repository.findById.mockResolvedValue(marcaMock);
    (productoHelper.canDelete as jest.Mock).mockResolvedValue(true);

    await service.softDelete('Marca1');

    expect(repository.softDelete).toHaveBeenCalled();
  });

  it('should throw NotFoundException if marca not found on softDelete', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(service.softDelete('Marca1')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw BadRequestException if canDelete returns false', async () => {
    repository.findById.mockResolvedValue(marcaMock);
    (productoHelper.canDelete as jest.Mock).mockResolvedValue(false);

    await expect(service.softDelete('Marca1')).rejects.toThrow(
      BadRequestException,
    );
    expect(repository.softDelete).not.toHaveBeenCalled();
  });
});
