import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './lib/auth';
import { UsersModule } from './users/users.module';
import { VentasModule } from './ventas/ventas.module'; // ← Agrega este import
import { PrismaService } from './prisma/prisma.service';
import { MarcaModule } from './marca/marca.module';
import { PrismaModule } from './prisma/prisma.module';
import { LineaModule } from './linea/linea.module';
import { clienteModule } from './cliente/cliente.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    AuthModule.forRoot({
      auth,
      disableGlobalAuthGuard: true,
    }),
    UsersModule,
    clienteModule,
    VentasModule,
    MarcaModule,
    PrismaModule,
    LineaModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
