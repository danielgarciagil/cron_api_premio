import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { config, validationENV } from '../../config/config';
import { CronModule } from '../cron/cron.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      //envFilePath: ['.env'],
      isGlobal: true,
      load: [config],
      //validationSchema: validationENV(), //TODO no estoy validando als variables
    }),
    CronModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
