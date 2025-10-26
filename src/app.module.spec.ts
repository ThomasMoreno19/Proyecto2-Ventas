// src/app.module.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { UsersModule } from './users/users.module';
import { VentasModule } from './ventas/ventas.module';
import { MarcaModule } from './marca/marca.module';
import { PrismaModule } from './prisma/prisma.module';
import { LineaModule } from './linea/linea.module';
import { ClienteModule } from './cliente/cliente.module';
import { ProductModule } from './product/product.module';

// Mock de módulos importados
jest.mock('./users/users.module', () => ({
  UsersModule: jest.fn(),
}));
jest.mock('./ventas/ventas.module', () => ({
  VentasModule: jest.fn(),
}));
jest.mock('./marca/marca.module', () => ({
  MarcaModule: jest.fn(),
}));
jest.mock('./prisma/prisma.module', () => ({
  PrismaModule: jest.fn(),
}));
jest.mock('./linea/linea.module', () => ({
  LineaModule: jest.fn(),
}));
jest.mock('./cliente/cliente.module', () => ({
  ClienteModule: jest.fn(),
}));
jest.mock('./product/product.module', () => ({
  ProductModule: jest.fn(),
}));

describe('AppModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  it('should compile the module', () => {
    expect(module).toBeDefined();
  });

  it('should have AppController registered', () => {
    const controller = module.get<AppController>(AppController);
    expect(controller).toBeDefined();
  });

  it('should have AppService registered', () => {
    const service = module.get<AppService>(AppService);
    expect(service).toBeDefined();
  });

  it('should have PrismaService registered', () => {
    const prismaService = module.get<PrismaService>(PrismaService);
    expect(prismaService).toBeDefined();
  });

  it('should import UsersModule', () => {
    expect(UsersModule).toHaveBeenCalled();
  });

  it('should import VentasModule', () => {
    expect(VentasModule).toHaveBeenCalled();
  });

  it('should import MarcaModule', () => {
    expect(MarcaModule).toHaveBeenCalled();
  });

  it('should import PrismaModule', () => {
    expect(PrismaModule).toHaveBeenCalled();
  });

  it('should import LineaModule', () => {
    expect(LineaModule).toHaveBeenCalled();
  });

  it('should import ClienteModule', () => {
    expect(ClienteModule).toHaveBeenCalled();
  });

  it('should import ProductModule', () => {
    expect(ProductModule).toHaveBeenCalledTimes(1); // Se importa dos veces en el código, pero Jest cuenta cada llamada
  });
});
