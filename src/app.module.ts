import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { MarcaModule } from './marca/marca.module';
import { PrismaModule } from './prisma/prisma.module';
import { LineaModule } from './linea/linea.module';

@Module({
  imports: [MarcaModule, PrismaModule, LineaModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
