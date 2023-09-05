import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

//Propio
import { GraphQLClient } from 'graphql-request';
import { LotenetApi, allLotenetPremioApiResponse } from '../types/sorteo';
import { pausaBySeg } from './funciones';

@Injectable()
export class AllLotenetPremioService {
  private graphQLClient: GraphQLClient;
  private readonly logger = new Logger('All-Lotenet-Premio-service');

  getUrl(): string {
    return this.configService.get<string>('URL_API');
  }

  constructor(private configService: ConfigService) {
    const url_api = this.getUrl();
    this.graphQLClient = new GraphQLClient(url_api);
  }

  async getAllLotenetPremioByDia(id_dia: number): Promise<LotenetApi[]> {
    const intentos = 10;
    for (let i = 0; i < intentos; i++) {
      try {
        return await this.consultaGetAllLotenetPremio(id_dia);
      } catch (error) {
        this.logger.error(`ERROR getAllLotenetPremioByDia => ${error}`);
        await pausaBySeg(10);
      }
    }
    return [];
  }

  async consultaGetAllLotenetPremio(id_dia: number): Promise<LotenetApi[]> {
    const lotenetApi: LotenetApi[] = [];
    const query = `query Query($idDia: Int) {
      allLotenetPremios(id_dia: $idDia) {
        id
        name
        activo
        premio_dia {
          dias {
            id
          }
          hora
        }
      }
    }`;

    const variables = {
      idDia: id_dia,
    };
    this.logger.verbose(
      `HACIENDO PETICION A LA API GetLotenetPremio => ${id_dia}`,
    );
    const data: allLotenetPremioApiResponse = await this.graphQLClient.request(
      query,
      variables,
    );
    data.allLotenetPremios.forEach((lotenetPremio) => {
      if (lotenetPremio.activo == false) return;

      if (lotenetPremio.premio_dia.length == 0) return;

      lotenetPremio.premio_dia.forEach((lotenet_premio_dia) => {
        if (lotenet_premio_dia.dias.id != id_dia) return;

        const newLotenetApi: LotenetApi = {
          hora: lotenet_premio_dia.hora,
          id_lotenet_premio: parseInt(lotenetPremio.id.toString()),
          name_lotenet_premio: lotenetPremio.name,
          activo: lotenetPremio.activo,
        };
        lotenetApi.push(newLotenetApi);
      });
    });
    return lotenetApi;
  }

  async createLotenetPremioById(id_lotenetPremio: number): Promise<void> {
    const intentos = 10;
    for (let i = 0; i < intentos; i++) {
      try {
        await this.generarPremioAutomaticoLotenet(id_lotenetPremio);
        break;
      } catch (error) {
        this.logger.error(`ERROR generarLotenetPremio => ${error}`);
        await pausaBySeg(10);
      }
    }
  }

  async generarPremioAutomaticoLotenet(
    id_lotenet_premio: number,
  ): Promise<void> {
    console.log(id_lotenet_premio);
    const query = `mutation GenerarPremioAutomaticoLotenet($buscarByLotenetPremio: BuscarByLotenerPremioInput!) {
      generarPremioAutomaticoLotenet(buscarByLotenetPremio: $buscarByLotenetPremio) {
        message
      }
    }`;
    const variables = {
      buscarByLotenetPremio: {
        id_lotenet_premio: id_lotenet_premio,
      },
    };
    console.log(query);
    console.log(variables);

    this.logger.verbose(
      `HACIENDO PETICION A LA API GenerarPremioAutomaticoLotenet => ID => ${id_lotenet_premio}`,
    );
    await this.graphQLClient.request(query, variables);
  }
}
