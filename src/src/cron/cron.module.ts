import { Module } from '@nestjs/common';

//Propio
import { CronService } from './cron.service';
import { CronController } from './cron.controller';
import { CronInitService } from './cron-init.service';
import { AllSorteoService } from './all-sorteo.service';

@Module({
  controllers: [CronController],
  providers: [CronService, CronInitService, AllSorteoService],
})
export class CronModule {}
