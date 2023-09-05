interface Dia {
  id: number;
}

interface SorteoDia {
  hora: string;
}

interface SorteoABuscar {
  id: number;
  activo: boolean;
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
  activo: boolean;
}

export interface LotenetPremioApi {
  id_sorteo: number;
  hora: string;
  name_sorteo: string;
  activo: boolean;
}

//TODO LOTENET
interface LotenetDia {
  hora: string;
  dias: Dia;
}

interface LotenetPremioABuscar {
  id: number;
  activo: boolean;
}

interface LotenetPremio {
  name: string;
  id: number;
  premio_dia: LotenetDia[];
  activo: boolean;
}

export interface allLotenetPremioApiResponse {
  allLotenetPremios: LotenetPremio[];
}

export interface LotenetApi {
  id_lotenet_premio: number;
  hora: string;
  name_lotenet_premio: string;
  activo: boolean;
}
