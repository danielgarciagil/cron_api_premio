import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

//Propio
import { GraphQLClient } from 'graphql-request';
import { SorteoApi, allSorteoApiResponse } from '../types/sorteo';

@Injectable()
export class AllSorteoService {
  private graphQLClient: GraphQLClient;

  getUrl(): string {
    return this.configService.get<string>('URL_API');
  }

  constructor(private configService: ConfigService) {
    const url_api = this.getUrl();
    this.graphQLClient = new GraphQLClient(url_api);
  }

  //TODO controlar errores
  async getAllSorteoByDia(id_dia: number): Promise<SorteoApi[]> {
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

  async createResultadoBySorteo(id_sorteo: number) {
    try {
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
      const data = await this.graphQLClient.request(query, variables);
      console.log(data);
      return data; // todo tipar respuesta
    } catch (error) {
      console.log(`PASO UN ERROR => ${error}`);
      return error;
    }
  }
}
