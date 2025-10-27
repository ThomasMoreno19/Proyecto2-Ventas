// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });

  // Enable cookie parser middleware
  app.use(cookieParser());

  app.enableCors({
    origin: true, // Allow all origins
    credentials: true, // si usás cookies/sesión
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS', 'PUT'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
      'Access-Control-Allow-Headers',
      'Access-Control-Request-Method',
      'Access-Control-Request-Headers',
    ],
    exposedHeaders: ['Authorization'],
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
