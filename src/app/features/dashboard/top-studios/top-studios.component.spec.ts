import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { MovieService } from '../../../core/services/movie.service';
import { tableRows } from '../../../../testing/dom';
import { MovieServiceSpy, createMovieServiceSpy } from '../../../../testing/movie-service.spy';
import { TopStudiosComponent } from './top-studios.component';

describe('TopStudiosComponent', () => {
  let movies: MovieServiceSpy;

  function render(): HTMLElement {
    const fixture = TestBed.createComponent(TopStudiosComponent);
    fixture.detectChanges();
    return fixture.nativeElement;
  }

  beforeEach(() => {
    movies = createMovieServiceSpy();
    TestBed.configureTestingModule({ providers: [{ provide: MovieService, useValue: movies }] });
  });

  it('renders the studios with their win counts', () => {
    movies.getTopStudios.and.returnValue(
      of([
        { name: 'Columbia Pictures', winCount: 6 },
        { name: 'Paramount Pictures', winCount: 6 },
        { name: 'Warner Bros.', winCount: 5 },
      ]),
    );

    expect(tableRows(render())).toEqual([
      ['Columbia Pictures', '6'],
      ['Paramount Pictures', '6'],
      ['Warner Bros.', '5'],
    ]);
  });

  it('shows an empty message when there are no studios', () => {
    expect(render().querySelector('td.empty')).not.toBeNull();
  });

  it('shows an error message when the request fails', () => {
    movies.getTopStudios.and.returnValue(throwError(() => new Error('fail')));

    expect(render().querySelector('[role="alert"]')).not.toBeNull();
  });
});
