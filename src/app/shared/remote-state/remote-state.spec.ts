import { Injector, runInInjectionContext } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';

import { loadRemote } from './remote-state';

describe('loadRemote', () => {
  const create = <T>(source$: Subject<T>) =>
    runInInjectionContext(TestBed.inject(Injector), () => loadRemote(source$));

  it('starts in the loading state', () => {
    const state = create(new Subject<string>());

    expect(state.loading()).toBeTrue();
    expect(state.error()).toBeFalse();
    expect(state.data()).toBeNull();
  });

  it('exposes the emitted value and stops loading', () => {
    const source$ = new Subject<string>();
    const state = create(source$);

    source$.next('value');

    expect(state.data()).toBe('value');
    expect(state.loading()).toBeFalse();
    expect(state.error()).toBeFalse();
  });

  it('flags an error and stops loading when the source fails', () => {
    const source$ = new Subject<string>();
    const state = create(source$);

    source$.error(new Error('boom'));

    expect(state.error()).toBeTrue();
    expect(state.loading()).toBeFalse();
    expect(state.data()).toBeNull();
  });
});
