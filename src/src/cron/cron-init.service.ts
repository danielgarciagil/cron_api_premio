import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as cron from 'node-cron';
import * as moment from 'moment';
//Propio

import { AllSorteoService } from './all-sorteo.service';
import { SorteoApi } from '../types/sorteo';
import { convertirHoraExpresionCron, id_fecha_hoy } from './funciones';

@Injectable()
export class CronInitService implements OnModuleInit {
  private readonly logger = new Logger('CRON-INIT');
  private tareas: SorteoApi[] = [
    //{ hora: '21:04:15', id_sorteo: 46, name_sorteo: 'LA PRIMERA MD 1' },
  ];

  constructor(private readonly allSorteoService: AllSorteoService) {}

  async getAllSorteoById() {
    this.logger.debug('Buscando sorteos nuevos');
    this.tareas = [];
    this.tareas = await this.allSorteoService.getAllSorteoByDia(id_fecha_hoy());
    this.logger.debug('Termino de buscar los nuevos sorteos');

    this.tareas.forEach((sorteoApi) => {
      const expresionCron = convertirHoraExpresionCron(sorteoApi.hora);
      this.logger.debug(
        `CRON => ${sorteoApi.name_sorteo} HORA: ${sorteoApi.hora} ID: ${sorteoApi.id_sorteo}`,
      );
      const newCron = cron.schedule(expresionCron, async () => {
        this.logger.debug(
          `INIT_CRON => ${sorteoApi.name_sorteo} => ${sorteoApi.id_sorteo}`,
        );
        await this.allSorteoService.createResultadoBySorteo(
          sorteoApi.id_sorteo,
        );
        newCron.stop();
      });
    });
  }

  async onModuleInit() {
    this.logger.debug('INICIO EL MODULO DE CRON');

    //? Este Cron es para consultar los sorteos
    cron.schedule('04 21 * * *', async () => {
      await this.getAllSorteoById();
    });

    cron.schedule('* * * * * *', async () => {
      const horaActual = moment().format('HH:mm:ss');
      this.logger.warn(`HORA ACTUAL: ${horaActual}`);
    });
  }
}

//this.tareas = [
//  { hora: '23:38:00', id_sorteo: 46, name_sorteo: 'LA PRIMERA MD 1' },
//  { hora: '23:38:00', id_sorteo: 46, name_sorteo: 'LA PRIMERA PM 2' },
//  { hora: '23:38:00', id_sorteo: 46, name_sorteo: 'LA PRIMERA PM 3' },
//  { hora: '23:38:00', id_sorteo: 46, name_sorteo: 'LA PRIMERA PM 4' },
//  { hora: '23:38:00', id_sorteo: 46, name_sorteo: 'LA PRIMERA PM 5' },
//  { hora: '23:38:00', id_sorteo: 46, name_sorteo: 'LA PRIMERA PM 6' },
//  { hora: '23:38:00', id_sorteo: 46, name_sorteo: 'LA PRIMERA PM 7' },
//  { hora: '23:38:00', id_sorteo: 46, name_sorteo: 'LA PRIMERA PM 8' },
//  { hora: '23:38:00', id_sorteo: 46, name_sorteo: 'LA PRIMERA PM 9' },
//  { hora: '23:38:00', id_sorteo: 46, name_sorteo: 'LA PRIMERA PM 10' },
//  { hora: '23:38:10', id_sorteo: 46, name_sorteo: 'LA PRIMERA PM 11' },
//  { hora: '23:38:10', id_sorteo: 46, name_sorteo: 'LA PRIMERA PM 12' },
//  { hora: '23:38:10', id_sorteo: 46, name_sorteo: 'LA PRIMERA PM 13' },
//  { hora: '23:38:10', id_sorteo: 46, name_sorteo: 'LA PRIMERA PM 14' },
//  { hora: '23:38:10', id_sorteo: 46, name_sorteo: 'LA PRIMERA PM 15' },
//  { hora: '23:38:10', id_sorteo: 46, name_sorteo: 'LA PRIMERA PM 16' },
//  { hora: '23:38:10', id_sorteo: 46, name_sorteo: 'LA PRIMERA PM 17' },
//  { hora: '23:38:10', id_sorteo: 46, name_sorteo: 'LA PRIMERA PM 18' },
//  { hora: '23:38:10', id_sorteo: 46, name_sorteo: 'LA PRIMERA PM 19' },
//  { hora: '23:38:10', id_sorteo: 46, name_sorteo: 'LA PRIMERA PM 20' },
//];
