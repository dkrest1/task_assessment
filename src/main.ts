import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('Task Management APIs')
    .setDescription(
      'Task Management API for a Task Assessment App. Users can create, read, update, and delete tasks. Authentication is implemented to manage user access and roles, allowing users to manage their tasks effectively.',
    )
    .setVersion('1.0')
    .addTag('task')
    .build();
  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };
  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api/docs', app, document);
  await app.listen(process.env.PORT);
}
bootstrap();
