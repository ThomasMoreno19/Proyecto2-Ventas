import { Module } from '@nestjs/common';
import { MarcaXlineaService } from './marca-xlinea.service';
import { MarcaXlineaController } from './marca-xlinea.controller';

@Module({
  controllers: [MarcaXlineaController],
  providers: [MarcaXlineaService],
})
export class MarcaXlineaModule {}
