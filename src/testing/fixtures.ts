import { Movie, Page } from '../app/core/models/movie.model';

export function buildMovie(overrides: Partial<Movie> = {}): Movie {
  return {
    id: 1,
    year: 1980,
    title: 'Movie Title',
    studios: ['Studio Name'],
    producers: ['Producer Name'],
    winner: false,
    ...overrides,
  };
}

export function buildPage(content: Movie[], overrides: Partial<Page<Movie>> = {}): Page<Movie> {
  return {
    content,
    totalElements: content.length,
    totalPages: 1,
    number: 0,
    size: 15,
    numberOfElements: content.length,
    first: true,
    last: true,
    ...overrides,
  };
}
