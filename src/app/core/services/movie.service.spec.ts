import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { buildMovie, buildPage } from '../../../testing/fixtures';
import { API_BASE_URL } from '../api.config';
import { MovieService } from './movie.service';

describe('MovieService', () => {
  const BASE_URL = 'http://api.test/movies';
  let service: MovieService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), { provide: API_BASE_URL, useValue: BASE_URL }],
    });
    service = TestBed.inject(MovieService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  describe('getMovies', () => {
    it('requests the page without optional filters', () => {
      const page = buildPage([buildMovie()]);
      let result: unknown;

      service.getMovies({ page: 2, size: 15 }).subscribe((value) => (result = value));

      const request = http.expectOne((req) => req.url === BASE_URL);
      expect(request.request.method).toBe('GET');
      expect(request.request.params.get('page')).toBe('2');
      expect(request.request.params.get('size')).toBe('15');
      expect(request.request.params.has('year')).toBeFalse();
      expect(request.request.params.has('winner')).toBeFalse();
      request.flush(page);
      expect(result).toEqual(page);
    });

    it('sends year and winner filters when provided', () => {
      service.getMovies({ page: 0, size: 15, year: 2018, winner: false }).subscribe();

      const request = http.expectOne((req) => req.url === BASE_URL);
      expect(request.request.params.get('year')).toBe('2018');
      expect(request.request.params.get('winner')).toBe('false');
      request.flush(buildPage([]));
    });
  });

  it('getYearsWithMultipleWinners unwraps the "years" list', () => {
    const years = [{ year: 1986, winnerCount: 2 }];
    let result: unknown;

    service.getYearsWithMultipleWinners().subscribe((value) => (result = value));

    const request = http.expectOne((req) => req.url === `${BASE_URL}/yearsWithMultipleWinners`);
    request.flush({ years });
    expect(result).toEqual(years);
  });

  describe('getTopStudios', () => {
    const studios = [
      { name: 'B', winCount: 2 },
      { name: 'A', winCount: 6 },
      { name: 'D', winCount: 1 },
      { name: 'C', winCount: 3 },
    ];

    it('returns the three studios with most wins, in descending order', () => {
      let result: unknown;

      service.getTopStudios().subscribe((value) => (result = value));

      const request = http.expectOne((req) => req.url === `${BASE_URL}/studiosWithWinCount`);
      request.flush({ studios });
      expect(result).toEqual([
        { name: 'A', winCount: 6 },
        { name: 'C', winCount: 3 },
        { name: 'B', winCount: 2 },
      ]);
    });

    it('honors a custom limit', () => {
      let result: unknown[] = [];

      service.getTopStudios(1).subscribe((value) => (result = value));

      http.expectOne((req) => req.url === `${BASE_URL}/studiosWithWinCount`).flush({ studios });
      expect(result.length).toBe(1);
    });
  });

  it('getProducerIntervals returns min and max intervals', () => {
    const intervals = {
      min: [{ producer: 'Joel Silver', interval: 1, previousWin: 1990, followingWin: 1991 }],
      max: [{ producer: 'Matthew Vaughn', interval: 13, previousWin: 2002, followingWin: 2015 }],
    };
    let result: unknown;

    service.getProducerIntervals().subscribe((value) => (result = value));

    const request = http.expectOne((req) => req.url === `${BASE_URL}/maxMinWinIntervalForProducers`);
    request.flush(intervals);
    expect(result).toEqual(intervals);
  });

  describe('getWinnersByYear', () => {
    it('requests winners of the given year', () => {
      const winners = [buildMovie({ id: 7, year: 2018, winner: true })];
      let result: unknown;

      service.getWinnersByYear(2018).subscribe((value) => (result = value));

      const request = http.expectOne((req) => req.url === `${BASE_URL}/winnersByYear`);
      expect(request.request.params.get('year')).toBe('2018');
      expect(request.request.params.has('winner')).toBeFalse();
      request.flush(winners);
      expect(result).toEqual(winners);
    });

    it('wraps a single-object response in a list', () => {
      const winner = buildMovie({ id: 9, winner: true });
      let result: unknown;

      service.getWinnersByYear(1990).subscribe((value) => (result = value));

      http.expectOne((req) => req.url === `${BASE_URL}/winnersByYear`).flush(winner);
      expect(result).toEqual([winner]);
    });
  });
});
