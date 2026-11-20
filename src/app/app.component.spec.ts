import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let element: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    element = fixture.nativeElement;
  });

  it('shows the application title', () => {
    expect(element.querySelector('h1')?.textContent).toContain('Frontend Angular Test');
  });

  it('has a menu with links to the dashboard and the movie list', () => {
    const links = Array.from(element.querySelectorAll('nav a'));

    expect(links.map((link) => link.textContent?.trim())).toEqual(['Dashboard', 'List']);
    expect(links.map((link) => link.getAttribute('href'))).toEqual(['/dashboard', '/movies']);
  });

  it('provides an outlet for the routed views', () => {
    expect(element.querySelector('router-outlet')).not.toBeNull();
  });
});
