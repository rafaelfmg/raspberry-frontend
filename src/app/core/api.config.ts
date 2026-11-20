import { InjectionToken } from '@angular/core';

import { environment } from '../../environments/environment';

/** URL base da API de filmes. Pode ser substituída nos testes ou por configuração. */
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => environment.apiUrl,
});
