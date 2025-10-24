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
import { MarcaXlineaModule } from './marca-xlinea/marca-xlinea.module';
import { ClienteModule } from './cliente/cliente.module';
import { ProductModule } from './Product/product.module';

@Module({
  imports: [
    AuthModule.forRoot({
      auth,
      disableGlobalAuthGuard: true,
    }),
    UsersModule,
    ClienteModule,
    ProductModule,
    VentasModule,
    MarcaModule,
    PrismaModule,
    LineaModule,
    MarcaXlineaModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
