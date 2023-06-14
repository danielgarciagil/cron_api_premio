import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT || 9999, () => {
    console.log(
      `👍El server esta arriba en el puerto: ${process.env.PORT || 9999} 👍💪`,
    );
  });
}
bootstrap();
