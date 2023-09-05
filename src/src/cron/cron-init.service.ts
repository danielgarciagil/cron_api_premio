import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as cron from 'node-cron';
import * as moment from 'moment';
//Propio

import { AllSorteoService } from './all-sorteo.service';
import { LotenetApi, SorteoApi } from '../types/sorteo';
import {
  ejecutarBorradoCache,
  convertirHoraExpresionCron,
  id_fecha_hoy,
} from './funciones';
import { AllLotenetPremioService } from './all-lotenet-premio.service';

@Injectable()
export class CronInitService implements OnModuleInit {
  private readonly logger = new Logger('CRON-INIT');
  private tareas: SorteoApi[] = [
    //{ hora: '21:04:15', id_sorteo: 46, name_sorteo: 'LA PRIMERA MD 1' },
  ];
  private tareas_lotenet: LotenetApi[] = [
    //{
    //  hora: '21:30:00',
    //  id_lotenet_premio: 9,
    //  name_lotenet_premio: 'FLORIDA MD DESARROLLO',
    //  activo: true,
    //},
  ];

  constructor(
    private readonly allSorteoService: AllSorteoService,
    private readonly allLotenetPremioService: AllLotenetPremioService,
  ) {}

  async getAllSorteoById() {
    this.logger.debug('Buscando sorteos nuevos');
    this.tareas = [];
    const cache = await ejecutarBorradoCache();
    this.logger.warn(cache);
    this.tareas = await this.allSorteoService.getAllSorteoByDia(id_fecha_hoy());
    this.logger.debug('Termino de buscar los nuevos sorteos');

    this.tareas.forEach((sorteoApi) => {
      const expresionCron = convertirHoraExpresionCron(sorteoApi.hora);
      this.logger.debug(
        `CRON-SORTEO => ${sorteoApi.name_sorteo} HORA: ${sorteoApi.hora} ID: ${sorteoApi.id_sorteo}`,
      );
      const newCron = cron.schedule(expresionCron, async () => {
        this.logger.debug(
          `INIT_CRON-SORTEO => ${sorteoApi.name_sorteo} => ${sorteoApi.id_sorteo}`,
        );
        await this.allSorteoService.createResultadoBySorteo(
          sorteoApi.id_sorteo,
        );
        newCron.stop();
      });
    });
  }

  async getAllLotenetPremioById() {
    this.logger.debug('Buscando Lotenet Premio nuevos');
    this.tareas_lotenet = [];
    const cache = await ejecutarBorradoCache();
    this.logger.warn(cache);

    this.tareas_lotenet =
      await this.allLotenetPremioService.getAllLotenetPremioByDia(
        id_fecha_hoy(),
      );
    this.logger.debug('Termino de buscar los Lotenet Premio sorteos');

    this.tareas_lotenet.forEach((lotenetPremio) => {
      const expresionCron = convertirHoraExpresionCron(lotenetPremio.hora);
      this.logger.debug(
        `CRON-LOTENET => ${lotenetPremio.name_lotenet_premio} HORA: ${lotenetPremio.hora} ID: ${lotenetPremio.id_lotenet_premio}`,
      );
      const newCron = cron.schedule(expresionCron, async () => {
        this.logger.debug(
          `INIT_CRON-LOTENET => ${lotenetPremio.name_lotenet_premio} => ${lotenetPremio.id_lotenet_premio}`,
        );
        await this.allLotenetPremioService.createLotenetPremioById(
          lotenetPremio.id_lotenet_premio,
        );
        newCron.stop();
      });
    });
  }

  async onModuleInit() {
    this.logger.debug('INICIO EL MODULO DE CRON');
    await this.getAllSorteoById();
    await this.getAllLotenetPremioById();

    //? Este Cron es para consultar los sorteos
    cron.schedule('10 0 * * *', async () => {
      await this.getAllSorteoById();
    });

    cron.schedule('* * * * *', async () => {
      const horaActual = moment().format('HH:mm:ss');
      this.logger.warn(`HORA ACTUAL: ${horaActual}`);
    });
  }
}
