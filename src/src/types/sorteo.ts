interface SorteoDia {
  hora: string;
}

interface SorteoABuscar {
  id: number;
}

interface Sorteo {
  name: string;
  id: string;
  sorteo_dias: SorteoDia[];
  sorteo_a_buscar: SorteoABuscar;
}

export interface allSorteoApiResponse {
  allSorteo: Sorteo[];
}

export interface SorteoApi {
  id_sorteo: number;
  hora: string;
  name_sorteo: string;
}
