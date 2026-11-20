import { of } from 'rxjs';

import { MovieService } from '../app/core/services/movie.service';
import { buildPage } from './fixtures';

export type MovieServiceSpy = jasmine.SpyObj<MovieService>;

/** Cria um dublê do MovieService cujos métodos retornam dados vazios por padrão. */
export function createMovieServiceSpy(): MovieServiceSpy {
  const spy = jasmine.createSpyObj<MovieService>('MovieService', [
    'getMovies',
    'getYearsWithMultipleWinners',
    'getTopStudios',
    'getProducerIntervals',
    'getWinnersByYear',
  ]);
  spy.getMovies.and.returnValue(of(buildPage([])));
  spy.getYearsWithMultipleWinners.and.returnValue(of([]));
  spy.getTopStudios.and.returnValue(of([]));
  spy.getProducerIntervals.and.returnValue(of({ min: [], max: [] }));
  spy.getWinnersByYear.and.returnValue(of([]));
  return spy;
}
