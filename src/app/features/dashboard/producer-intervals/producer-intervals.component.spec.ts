import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { MovieService } from '../../../core/services/movie.service';
import { tableRows } from '../../../../testing/dom';
import { MovieServiceSpy, createMovieServiceSpy } from '../../../../testing/movie-service.spy';
import { ProducerIntervalsComponent } from './producer-intervals.component';

describe('ProducerIntervalsComponent', () => {
  let movies: MovieServiceSpy;

  function render(): HTMLElement {
    const fixture = TestBed.createComponent(ProducerIntervalsComponent);
    fixture.detectChanges();
    return fixture.nativeElement;
  }

  beforeEach(() => {
    movies = createMovieServiceSpy();
    TestBed.configureTestingModule({ providers: [{ provide: MovieService, useValue: movies }] });
  });

  it('renders the maximum and minimum tables', () => {
    movies.getProducerIntervals.and.returnValue(
      of({
        min: [{ producer: 'Joel Silver', interval: 1, previousWin: 1990, followingWin: 1991 }],
        max: [{ producer: 'Matthew Vaughn', interval: 13, previousWin: 2002, followingWin: 2015 }],
      }),
    );

    const element = render();
    const captions = Array.from(element.querySelectorAll('h3')).map((caption) => caption.textContent?.trim());
    const tables = element.querySelectorAll('table');

    expect(captions).toEqual(['Maximum', 'Minimum']);
    expect(tableRows(tables[0])).toEqual([['Matthew Vaughn', '13', '2002', '2015']]);
    expect(tableRows(tables[1])).toEqual([['Joel Silver', '1', '1990', '1991']]);
  });

  it('renders every tied producer', () => {
    movies.getProducerIntervals.and.returnValue(
      of({
        min: [
          { producer: 'A', interval: 1, previousWin: 2000, followingWin: 2001 },
          { producer: 'B', interval: 1, previousWin: 2010, followingWin: 2011 },
        ],
        max: [],
      }),
    );

    const tables = render().querySelectorAll('table');

    expect(tableRows(tables[1]).length).toBe(2);
    expect(tables[0].querySelector('td.empty')).not.toBeNull();
  });

  it('shows an error message when the request fails', () => {
    movies.getProducerIntervals.and.returnValue(throwError(() => new Error('fail')));

    const element = render();

    expect(element.querySelector('[role="alert"]')).not.toBeNull();
    expect(element.querySelector('table')).toBeNull();
  });
});
