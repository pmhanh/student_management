import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, BadRequestException } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        exceptionFactory: (errors) => {
            return new BadRequestException(
                errors
                    .map(err => err.constraints ? Object.values(err.constraints).join(', ') : 'Lỗi không xác định')
            );
        }
    }));

    app.enableCors();
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
