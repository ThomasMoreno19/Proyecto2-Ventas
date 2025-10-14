import { Test, TestingModule } from '@nestjs/testing';
import { MarcaXlineaService } from './marca-xlinea.service';

describe('MarcaXlineaService', () => {
  let service: MarcaXlineaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MarcaXlineaService],
    }).compile();

    service = module.get<MarcaXlineaService>(MarcaXlineaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
