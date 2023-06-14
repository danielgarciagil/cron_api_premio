import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as cron from 'node-cron';
import * as moment from 'moment';
//Propio

import { AllSorteoService } from './all-sorteo.service';
import { SorteoApi } from '../types/sorteo';

@Injectable()
export class CronInitService implements OnModuleInit {
  private readonly logger = new Logger('CRON-INIT');
  private tareas: SorteoApi[] = [];

  constructor(private readonly allSorteoService: AllSorteoService) {}

  id_fecha_hoy(): number {
    const fecha_actual = new Date();
    return fecha_actual.getDay() + 1; //todo
  }

  convertirHoraExpresionCron(hora: string): string {
    // Desglosar la hora en componentes
    const [horaStr, minStr, segStr] = hora.split(':');
    const horaNum = parseInt(horaStr, 10);
    const minNum = parseInt(minStr, 10);
    const segNum = parseInt(segStr, 10);

    // Construir la expresión cron
    return `${segNum} ${minNum} ${horaNum} * * *`;
  }

  async getAllSorteoById() {
    console.log('Entro en getAllSorteo');
    this.tareas = [];
    this.tareas = await this.allSorteoService.getAllSorteoByDia(
      this.id_fecha_hoy(),
    );
    console.log('Termino la consulta');
    //this.tareas = [
    //  { hora: '22:11:00', id_sorteo: 1, name_sorteo: 'LA PRIMERA MD 1' },
    //  { hora: '22:11:00', id_sorteo: 2, name_sorteo: 'LA PRIMERA PM 2' },
    //  { hora: '22:11:00', id_sorteo: 2, name_sorteo: 'LA PRIMERA PM 3' },
    //  { hora: '22:11:00', id_sorteo: 2, name_sorteo: 'LA PRIMERA PM 4' },
    //  { hora: '22:11:00', id_sorteo: 2, name_sorteo: 'LA PRIMERA PM 5' },
    //  { hora: '22:11:00', id_sorteo: 2, name_sorteo: 'LA PRIMERA PM 6' },
    //  { hora: '22:11:00', id_sorteo: 2, name_sorteo: 'LA PRIMERA PM 7' },
    //  { hora: '22:11:00', id_sorteo: 2, name_sorteo: 'LA PRIMERA PM 8' },
    //  { hora: '22:11:00', id_sorteo: 2, name_sorteo: 'LA PRIMERA PM 9' },
    //  { hora: '22:11:00', id_sorteo: 2, name_sorteo: 'LA PRIMERA PM 10' },
    //  { hora: '22:39:10', id_sorteo: 2, name_sorteo: 'LA PRIMERA PM 11' },
    //];

    this.tareas.forEach((sorteoApi) => {
      const expresionCron = this.convertirHoraExpresionCron(sorteoApi.hora);
      console.log(
        `SE PROGRAMO UNA TAREA PARA: ${sorteoApi.name_sorteo} a las ${sorteoApi.hora} ID: ${sorteoApi.id_sorteo}`,
      );
      const newCron = cron.schedule(expresionCron, async () => {
        console.log(`Inicio la consulta API para ${sorteoApi.name_sorteo}`);
        await this.allSorteoService.createResultadoBySorteo(
          sorteoApi.id_sorteo,
        );
        newCron.stop();
      });
    });
  }

  async onModuleInit() {
    this.logger.debug('INICIO EL MODULO DE CRON');

    cron.schedule('29 23 * * *', async () => {
      await this.getAllSorteoById();
    });

    cron.schedule(' * * * * * *', async () => {
      const horaActual = moment().format('HH:mm:ss');
      console.log(horaActual);
    });
  }
}