import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

//Propio
import { GraphQLClient } from 'graphql-request';
import { SorteoApi, allSorteoApiResponse } from '../types/sorteo';
import { pausaBySeg } from './funciones';

@Injectable()
export class AllSorteoService {
  private graphQLClient: GraphQLClient;
  private readonly logger = new Logger('All-Sorteo-service');

  getUrl(): string {
    return this.configService.get<string>('URL_API');
  }

  constructor(private configService: ConfigService) {
    const url_api = this.getUrl();
    this.graphQLClient = new GraphQLClient(url_api);
  }

  async getAllSorteoByDia(id_dia: number): Promise<SorteoApi[]> {
    const intentos = 10;
    for (let i = 0; i < intentos; i++) {
      try {
        return await this.consultaGetAllSorteoDia(id_dia);
      } catch (error) {
        this.logger.error(`ERROR getAllSorteoByDia => ${error}`);
        await pausaBySeg(10);
      }
    }
    return [];
  }

  async consultaGetAllSorteoDia(id_dia: number): Promise<SorteoApi[]> {
    const sorteosApi: SorteoApi[] = [];
    const query = `query AllSorteo( $idDia: Int, ) {
      allSorteo(id_dia: $idDia, ) {
        name
        sorteo_dias {
          hora
        }
        sorteo_a_buscar {
          id
        }
      }
    }`;
    const variables = {
      idDia: id_dia,
    };
    this.logger.verbose(
      `HACIENDO PETICION A LA API GetAllSorteoDia => ${id_dia}`,
    );
    const data: allSorteoApiResponse = await this.graphQLClient.request(
      query,
      variables,
    );
    data.allSorteo.forEach((sorteo) => {
      if (sorteo.sorteo_a_buscar) {
        //TODO PROBAR UN SORTEO QUE NO TENGA E BUSCAR
        sorteo.sorteo_dias.forEach((sorteos_dias) => {
          const newSorteoApi: SorteoApi = {
            hora: sorteos_dias.hora,
            id_sorteo: parseInt(sorteo.sorteo_a_buscar.id.toString()),
            name_sorteo: sorteo.name,
          };
          sorteosApi.push(newSorteoApi);
        });
      }
    });
    return sorteosApi;
  }

  async createResultadoBySorteo(id_dia: number): Promise<boolean> {
    const intentos = 10;
    for (let i = 0; i < intentos; i++) {
      try {
        return await this.generarResultadoBySorteo(id_dia);
      } catch (error) {
        this.logger.error(`ERROR generarResultadoBySorteo => ${error}`);
        await pausaBySeg(10);
      }
    }
    return false;
  }

  async generarResultadoBySorteo(id_sorteo: number): Promise<boolean> {
    const query = `mutation GenerarResultadoAutomatico($buscarBySorteoaBuscarInput: BuscarBySorteoaBuscarInput!) {
        generarResultadoAutomatico(buscarBySorteoaBuscarInput: $buscarBySorteoaBuscarInput) {
          message
        }
      }`;
    const variables = {
      buscarBySorteoaBuscarInput: {
        id_sorteo_a_buscar: id_sorteo,
      },
    };
    this.logger.verbose(
      `HACIENDO PETICION A LA API generarResultadoBySorteo => ID => ${id_sorteo}`,
    );
    await this.graphQLClient.request(query, variables);
    return true;
  }
}
