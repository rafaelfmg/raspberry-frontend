export interface Movie {
  id: number;
  year: number;
  title: string;
  studios: string[];
  producers: string[];
  winner: boolean;
}

/** Resposta paginada da API (formato Spring Data). */
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  /** Índice da página atual, iniciando em 0. */
  number: number;
  size: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
}

export interface MovieQuery {
  page: number;
  size: number;
  year?: number;
  winner?: boolean;
}

export interface YearWinnerCount {
  year: number;
  winnerCount: number;
}

export interface StudioWinCount {
  name: string;
  winCount: number;
}

export interface ProducerInterval {
  producer: string;
  interval: number;
  previousWin: number;
  followingWin: number;
}

export interface ProducerIntervals {
  min: ProducerInterval[];
  max: ProducerInterval[];
}
