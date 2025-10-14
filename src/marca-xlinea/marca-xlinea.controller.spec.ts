import { Test, TestingModule } from '@nestjs/testing';
import { MarcaXlineaController } from './marca-xlinea.controller';
import { MarcaXlineaService } from './marca-xlinea.service';

describe('MarcaXlineaController', () => {
  let controller: MarcaXlineaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MarcaXlineaController],
      providers: [MarcaXlineaService],
    }).compile();

    controller = module.get<MarcaXlineaController>(MarcaXlineaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
