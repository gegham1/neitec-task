import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { AppModule } from './app.module';

async function bootstrap() {
  initializeTransactionalContext();

  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const appEnv = configService.get<string>('app.env');

  app.useGlobalPipes(new ValidationPipe());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Neitec Home Task')
    .setDescription('REST API for submitting and validating transactions.')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);

  if (appEnv === 'local') {
    SwaggerModule.setup('docs', app, document);
  }

  await app.listen(configService.get('app.port'));
}

bootstrap();
