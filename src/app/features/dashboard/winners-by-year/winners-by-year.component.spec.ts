import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { MovieService } from '../../../core/services/movie.service';
import { buildMovie } from '../../../../testing/fixtures';
import { MovieServiceSpy, createMovieServiceSpy } from '../../../../testing/movie-service.spy';
import { WinnersByYearComponent } from './winners-by-year.component';

describe('WinnersByYearComponent', () => {
  let movies: MovieServiceSpy;
  let fixture: ComponentFixture<WinnersByYearComponent>;
  let element: HTMLElement;

  function search(year: string): void {
    const input = element.querySelector('input')!;
    input.value = year;
    input.dispatchEvent(new Event('input'));
    element.querySelector<HTMLButtonElement>('button')!.click();
    fixture.detectChanges();
  }

  beforeEach(() => {
    movies = createMovieServiceSpy();
    TestBed.configureTestingModule({ providers: [{ provide: MovieService, useValue: movies }] });
    fixture = TestBed.createComponent(WinnersByYearComponent);
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('does not request data nor show a table before the first search', () => {
    expect(movies.getWinnersByYear).not.toHaveBeenCalled();
    expect(element.querySelector('table')).toBeNull();
  });

  it('lists the winners of the searched year', () => {
    movies.getWinnersByYear.and.returnValue(of([buildMovie({ id: 12, year: 2018, title: 'Winner Title', winner: true })]));

    search('2018');

    expect(movies.getWinnersByYear).toHaveBeenCalledOnceWith(2018);
    const cells = Array.from(element.querySelectorAll('tbody td')).map((cell) => cell.textContent?.trim());
    expect(cells).toEqual(['12', '2018', 'Winner Title']);
  });

  it('shows a message when the year has no winners', () => {
    search('1950');

    expect(element.querySelector('td.empty')?.textContent).toContain('1950');
  });

  it('searches when Enter is pressed in the input', () => {
    const input = element.querySelector('input')!;
    input.value = '2000';
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

    expect(movies.getWinnersByYear).toHaveBeenCalledOnceWith(2000);
  });

  it('rejects invalid years without calling the API', () => {
    search('abc');

    expect(movies.getWinnersByYear).not.toHaveBeenCalled();
    expect(element.querySelector('[role="alert"]')?.textContent).toContain('4-digit year');
  });

  it('rejects an empty year', () => {
    search('');

    expect(movies.getWinnersByYear).not.toHaveBeenCalled();
    expect(element.querySelector('[role="alert"]')).not.toBeNull();
  });

  it('shows an error message when the request fails', () => {
    movies.getWinnersByYear.and.returnValue(throwError(() => new Error('fail')));

    search('2018');

    expect(element.querySelector('[role="alert"]')?.textContent).toContain('Could not load');
    expect(element.querySelector('table')).toBeNull();
  });
});
