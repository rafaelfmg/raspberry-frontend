import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { MovieService } from '../../../core/services/movie.service';
import { tableRows } from '../../../../testing/dom';
import { MovieServiceSpy, createMovieServiceSpy } from '../../../../testing/movie-service.spy';
import { YearsWithMultipleWinnersComponent } from './years-with-multiple-winners.component';

describe('YearsWithMultipleWinnersComponent', () => {
  let movies: MovieServiceSpy;

  function render(): HTMLElement {
    const fixture = TestBed.createComponent(YearsWithMultipleWinnersComponent);
    fixture.detectChanges();
    return fixture.nativeElement;
  }

  beforeEach(() => {
    movies = createMovieServiceSpy();
    TestBed.configureTestingModule({ providers: [{ provide: MovieService, useValue: movies }] });
  });

  it('renders one row per year with its winner count', () => {
    movies.getYearsWithMultipleWinners.and.returnValue(
      of([
        { year: 1986, winnerCount: 2 },
        { year: 1990, winnerCount: 2 },
      ]),
    );

    expect(tableRows(render())).toEqual([
      ['1986', '2'],
      ['1990', '2'],
    ]);
  });

  it('shows an empty message when there are no years', () => {
    expect(render().querySelector('td.empty')).not.toBeNull();
  });

  it('shows an error message when the request fails', () => {
    movies.getYearsWithMultipleWinners.and.returnValue(throwError(() => new Error('fail')));

    const element = render();

    expect(element.querySelector('[role="alert"]')).not.toBeNull();
    expect(element.querySelector('table')).toBeNull();
  });
});
