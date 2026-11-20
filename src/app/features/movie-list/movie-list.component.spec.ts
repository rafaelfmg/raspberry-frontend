import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { MovieService } from '../../core/services/movie.service';
import { tableRows } from '../../../testing/dom';
import { buildMovie, buildPage } from '../../../testing/fixtures';
import { MovieServiceSpy, createMovieServiceSpy } from '../../../testing/movie-service.spy';
import { MovieListComponent } from './movie-list.component';

describe('MovieListComponent', () => {
  let movies: MovieServiceSpy;
  let fixture: ComponentFixture<MovieListComponent>;
  let element: HTMLElement;

  const firstPage = buildPage(
    [buildMovie({ id: 1, year: 1980, title: 'First', winner: true }), buildMovie({ id: 2, year: 1981, title: 'Second' })],
    { totalElements: 30, totalPages: 2 },
  );

  const typeYear = (value: string) => {
    const input = element.querySelector<HTMLInputElement>('input[aria-label="Filter by year"]')!;
    input.value = value;
    input.dispatchEvent(new Event('input'));
  };

  const selectWinner = (value: string) => {
    const select = element.querySelector<HTMLSelectElement>('select[aria-label="Filter by winner"]')!;
    select.value = value;
    select.dispatchEvent(new Event('change'));
  };

  const lastQuery = () => movies.getMovies.calls.mostRecent().args[0];

  beforeEach(() => {
    movies = createMovieServiceSpy();
    movies.getMovies.and.returnValue(of(firstPage));
    TestBed.configureTestingModule({ providers: [{ provide: MovieService, useValue: movies }] });
    fixture = TestBed.createComponent(MovieListComponent);
    element = fixture.nativeElement;
  });

  it('loads the first page of 15 movies without filters', () => {
    fixture.detectChanges();

    expect(movies.getMovies).toHaveBeenCalledOnceWith({ page: 0, size: 15 });
  });

  it('renders the movies of the page', () => {
    fixture.detectChanges();

    expect(tableRows(element)).toEqual([
      ['1', '1980', 'First', 'Yes'],
      ['2', '1981', 'Second', 'No'],
    ]);
  });

  it('shows an empty message when no movie is found', () => {
    movies.getMovies.and.returnValue(of(buildPage([])));

    fixture.detectChanges();

    expect(element.querySelector('td.empty')).not.toBeNull();
  });

  it('shows an error message when the request fails', () => {
    movies.getMovies.and.returnValue(throwError(() => new Error('fail')));

    fixture.detectChanges();

    expect(element.querySelector('[role="alert"]')).not.toBeNull();
  });

  it('requests the selected page when the pagination changes', () => {
    fixture.detectChanges();

    element.querySelector<HTMLButtonElement>('button[aria-label="Next page"]')!.click();

    expect(lastQuery()).toEqual({ page: 1, size: 15 });
  });

  it('filters by winner and returns to the first page', () => {
    fixture.detectChanges();
    element.querySelector<HTMLButtonElement>('button[aria-label="Next page"]')!.click();

    selectWinner('true');
    expect(lastQuery()).toEqual({ page: 0, size: 15, winner: true });

    selectWinner('false');
    expect(lastQuery()).toEqual({ page: 0, size: 15, winner: false });

    selectWinner('');
    expect(lastQuery()).toEqual({ page: 0, size: 15 });
  });

  it('filters by year after the user stops typing', fakeAsync(() => {
    fixture.detectChanges();

    typeYear('2018');
    tick(300);
    expect(movies.getMovies).toHaveBeenCalledTimes(1);

    tick(100);
    expect(lastQuery()).toEqual({ page: 0, size: 15, year: 2018 });
  }));

  it('ignores incomplete years', fakeAsync(() => {
    fixture.detectChanges();

    typeYear('20');
    tick(500);

    expect(movies.getMovies).toHaveBeenCalledTimes(1);
  }));

  it('combines the year and winner filters', fakeAsync(() => {
    fixture.detectChanges();

    typeYear('2018');
    tick(400);
    selectWinner('true');

    expect(lastQuery()).toEqual({ page: 0, size: 15, year: 2018, winner: true });
  }));

  it('removes the year filter when the field is cleared', fakeAsync(() => {
    fixture.detectChanges();
    typeYear('2018');
    tick(400);

    typeYear('');
    tick(400);

    expect(lastQuery()).toEqual({ page: 0, size: 15 });
  }));
});
