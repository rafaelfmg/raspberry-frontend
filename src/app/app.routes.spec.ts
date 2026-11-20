import { Router, provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { RouterTestingHarness } from '@angular/router/testing';

import { createMovieServiceSpy } from '../testing/movie-service.spy';
import { MovieService } from './core/services/movie.service';
import { routes } from './app.routes';

describe('routes', () => {
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes), { provide: MovieService, useValue: createMovieServiceSpy() }],
    });
    harness = await RouterTestingHarness.create();
  });

  it('redirects the root path to the dashboard', async () => {
    await harness.navigateByUrl('/');

    expect(TestBed.inject(Router).url).toBe('/dashboard');
    expect(harness.routeNativeElement?.tagName.toLowerCase()).toBe('app-dashboard');
  });

  it('renders the movie list on /movies', async () => {
    await harness.navigateByUrl('/movies');

    expect(harness.routeNativeElement?.tagName.toLowerCase()).toBe('app-movie-list');
  });

  it('redirects unknown paths to the dashboard', async () => {
    await harness.navigateByUrl('/unknown');

    expect(TestBed.inject(Router).url).toBe('/dashboard');
  });
});
