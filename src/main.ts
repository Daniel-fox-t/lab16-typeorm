import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port: number = parseInt(process.env.PORT || '3000', 10);
  await app.listen(port);
  console.log('Server running on http://localhost:' + port);
}
bootstrap();