import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Request body size limit 증가 (10MB)
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  // CORS 설정 추가
  app.enableCors({
    origin:
      process.env.NODE_ENV === 'production'
        ? process.env.FRONTEND_URL || false
        : [
            'http://localhost:3000', // Next.js 개발 서버
            'http://localhost:3001', // 다른 포트 허용
            'http://127.0.0.1:3000',
            'http://127.0.0.1:3001',
          ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 8080);
  console.log(
    `🚀 Application is running on: http://localhost:${process.env.PORT ?? 8080}`,
  );
}
void bootstrap();
