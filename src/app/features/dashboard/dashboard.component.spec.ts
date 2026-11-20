import { TestBed } from '@angular/core/testing';

import { MovieService } from '../../core/services/movie.service';
import { createMovieServiceSpy } from '../../../testing/movie-service.spy';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [{ provide: MovieService, useValue: createMovieServiceSpy() }] });
  });

  it('renders the four dashboard panels', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;

    const headings = Array.from(element.querySelectorAll('h2')).map((heading) => heading.textContent?.trim());

    expect(headings).toEqual([
      'List years with multiple winners',
      'Top 3 studios with winners',
      'Producers with longest and shortest interval between wins',
      'List movie winners by year',
    ]);
  });
});
