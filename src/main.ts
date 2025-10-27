// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });

  app.enableCors({
    origin: true, // Allow all origins
    credentials: true, // Allow cookies/session
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS', 'PUT'],
    allowedHeaders: ['*'],
  });

  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('Documentación de la API con Swagger')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Agregar el puerto y el listen
  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
  console.log(`📚 Documentación disponible en http://localhost:${port}/api/docs`);
}

// Cambiar void bootstrap() por una llamada async
bootstrap().catch((error) => {
  console.error('Error al iniciar la aplicación:', error);
  process.exit(1);
});
