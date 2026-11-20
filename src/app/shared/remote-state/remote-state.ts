import { Signal, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

export interface RemoteState<T> {
  readonly data: Signal<T | null>;
  readonly loading: Signal<boolean>;
  readonly error: Signal<boolean>;
}

/**
 * Assina `source$` e expõe o resultado como signals de dados, carregamento e erro.
 * A assinatura é encerrada quando o componente é destruído.
 * Deve ser chamada em contexto de injeção (ex.: inicializador de campo de um componente).
 */
export function loadRemote<T>(source$: Observable<T>): RemoteState<T> {
  const data = signal<T | null>(null);
  const loading = signal(true);
  const error = signal(false);

  source$.pipe(takeUntilDestroyed()).subscribe({
    next: (value) => {
      data.set(value);
      loading.set(false);
    },
    error: () => {
      error.set(true);
      loading.set(false);
    },
  });

  return { data, loading, error };
}
