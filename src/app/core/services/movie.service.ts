import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { API_BASE_URL } from '../api.config';
import {
  Movie,
  MovieQuery,
  Page,
  ProducerIntervals,
  StudioWinCount,
  YearWinnerCount,
} from '../models/movie.model';

/** Sub-rotas da API, relativas à URL base (conforme a documentação do desafio). */
const ENDPOINT = {
  yearsWithMultipleWinners: 'yearsWithMultipleWinners',
  studiosWithWinCount: 'studiosWithWinCount',
  producerIntervals: 'maxMinWinIntervalForProducers',
  winnersByYear: 'winnersByYear',
} as const;

const TOP_STUDIOS_LIMIT = 3;

/** Acesso à API de indicados e vencedores do Golden Raspberry Awards. */
@Injectable({ providedIn: 'root' })
export class MovieService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  /** Lista paginada de filmes, com filtros opcionais por ano e vencedor. */
  getMovies(query: MovieQuery): Observable<Page<Movie>> {
    let params = new HttpParams().set('page', query.page).set('size', query.size);
    if (query.year !== undefined) {
      params = params.set('year', query.year);
    }
    if (query.winner !== undefined) {
      params = params.set('winner', query.winner);
    }
    return this.http.get<Page<Movie>>(this.baseUrl, { params });
  }

  getYearsWithMultipleWinners(): Observable<YearWinnerCount[]> {
    return this.http
      .get<{ years: YearWinnerCount[] }>(this.url('yearsWithMultipleWinners'))
      .pipe(map((response) => response.years));
  }

  /** Estúdios com mais vitórias, em ordem decrescente, limitado aos `limit` primeiros. */
  getTopStudios(limit = TOP_STUDIOS_LIMIT): Observable<StudioWinCount[]> {
    return this.http
      .get<{ studios: StudioWinCount[] }>(this.url('studiosWithWinCount'))
      .pipe(map((response) => [...response.studios].sort((a, b) => b.winCount - a.winCount).slice(0, limit)));
  }

  getProducerIntervals(): Observable<ProducerIntervals> {
    return this.http.get<ProducerIntervals>(this.url('producerIntervals'));
  }

  /** Vencedores de um ano. Aceita resposta como lista ou como objeto único. */
  getWinnersByYear(year: number): Observable<Movie[]> {
    const params = new HttpParams().set('year', year);
    return this.http
      .get<Movie | Movie[]>(this.url('winnersByYear'), { params })
      .pipe(map((response) => (Array.isArray(response) ? response : [response])));
  }

  private url(endpoint: keyof typeof ENDPOINT): string {
    return `${this.baseUrl}/${ENDPOINT[endpoint]}`;
  }
}
