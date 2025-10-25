import { Test, TestingModule } from '@nestjs/testing';
import { LineaService } from './linea.service';
import { LineaRepository } from './repositories/linea.repository';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { asociarMarcas } from './helpers/marcaxlinea.helper';
import { checkUniqueName } from '../common/helpers/check.nombre.helper';
import { canDelete } from './helpers/check.producto';
import { CreateLineaDto } from './dto/create-linea.dto';
import { UpdateLineaDto } from './dto/update-linea.dto';

jest.mock('./helpers/marcaxlinea.helper');
jest.mock('../common/helpers/check.nombre.helper');
jest.mock('./helpers/check.producto');

describe('LineaService', () => {
  let service: LineaService;
  let lineaRepo: jest.Mocked<LineaRepository>;
  let prisma: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LineaService,
        {
          provide: LineaRepository,
          useValue: {
            findAll: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            // SOLUCIÓN 2: arrow function para evitar ESLint unbound-method
            softDelete: jest.fn(() => undefined),
          },
        },
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<LineaService>(LineaService);
    lineaRepo = module.get(LineaRepository);
    prisma = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('findAll devuelve DTOs', async () => {
    const mockLineas = [{ id: '1', nombre: 'Linea1', descripcion: 'desc' }];
    lineaRepo.findAll.mockResolvedValue(mockLineas as any);

    const result = await service.findAll();
    expect(result).toHaveLength(1);
    expect(result[0].nombre).toBe('Linea1');
  });

  it('findById lanza NotFound si no existe', async () => {
    lineaRepo.findById.mockResolvedValue(null);
    await expect(service.findById('noexiste')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('findById devuelve DTO si existe', async () => {
    lineaRepo.findById.mockResolvedValue({
      id: '1',
      nombre: 'Linea1',
      descripcion: 'desc',
    } as any);
    const result = await service.findById('Linea1');
    expect(result.nombre).toBe('Linea1');
  });

  it('create llama a repository y helper', async () => {
    const dto: CreateLineaDto = {
      nombre: 'Nueva',
      descripcion: 'desc',
      marcaIds: ['1'],
    };
    (checkUniqueName as jest.Mock).mockResolvedValue(undefined);
    lineaRepo.create.mockResolvedValue({ id: '1', ...dto } as any);
    (asociarMarcas as jest.Mock).mockResolvedValue(undefined);

    const result = await service.create(dto);

    expect(checkUniqueName).toHaveBeenCalled();
    expect(lineaRepo.create).toHaveBeenCalledWith(dto);
    expect(asociarMarcas).toHaveBeenCalledWith({
      prisma,
      lineaId: '1',
      marcaIds: dto.marcaIds,
    });
    expect(result.nombre).toBe('Nueva');
  });

  it('update lanza NotFound si no existe', async () => {
    prisma.linea = { findUnique: jest.fn().mockResolvedValue(null) } as any;
    await expect(service.update('noexiste', {} as UpdateLineaDto)).rejects.toThrow(NotFoundException);
  });

  it('update llama a repository y helper si hay marcas', async () => {
    prisma.linea = {
      findUnique: jest.fn().mockResolvedValue({ id: '1' })
    } as any;
    const dto: UpdateLineaDto = { descripcion: 'mod', marcaIds: ['1'] };
    lineaRepo.update.mockResolvedValue({
      id: '1',
      nombre: 'Linea1',
      descripcion: 'mod',
    } as any);
    (asociarMarcas as jest.Mock).mockResolvedValue(undefined);

    const result = await service.update('Linea1', dto);
    expect(lineaRepo.update).toHaveBeenCalledWith('Linea1', dto);
    expect(asociarMarcas).toHaveBeenCalledWith({
      prisma,
      lineaId: '1',
      marcaIds: dto.marcaIds,
    });
    expect(result.descripcion).toBe('mod');
  });

  it('softDelete lanza NotFound si no existe', async () => {
    lineaRepo.findById.mockResolvedValue(null);
    await expect(service.softDelete('noexiste')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('softDelete lanza BadRequest si canDelete es false', async () => {
    lineaRepo.findById.mockResolvedValue({ id: '1' } as any);
    (canDelete as jest.Mock).mockResolvedValue(false);
    await expect(service.softDelete('Linea1')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('softDelete llama a repository si se puede borrar', async () => {
    lineaRepo.findById.mockResolvedValue({ id: '1' } as any);
    (canDelete as jest.Mock).mockResolvedValue(true);

    await service.softDelete('Linea1');

    expect(lineaRepo.softDelete).toHaveBeenCalledWith('Linea1');
  });
});
