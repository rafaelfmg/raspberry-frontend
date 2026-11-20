import { Component, input } from '@angular/core';

import { ProducerInterval } from '../../../core/models/movie.model';

/** Tabela de intervalos entre vitórias de produtores (usada para máximo e mínimo). */
@Component({
  selector: 'app-interval-table',
  template: `
    <h3 class="caption">{{ caption() }}</h3>
    <table class="data-table">
      <thead>
        <tr>
          <th>Producer</th>
          <th>Interval</th>
          <th>Previous Year</th>
          <th>Following Year</th>
        </tr>
      </thead>
      <tbody>
        @for (row of rows(); track row.producer + row.previousWin + row.followingWin) {
          <tr>
            <td>{{ row.producer }}</td>
            <td>{{ row.interval }}</td>
            <td>{{ row.previousWin }}</td>
            <td>{{ row.followingWin }}</td>
          </tr>
        } @empty {
          <tr>
            <td class="empty" colspan="4">No data.</td>
          </tr>
        }
      </tbody>
    </table>
  `,
  styles: `
    .caption {
      margin: 8px 0 6px;
      font-size: 14px;
      font-weight: 500;
      color: var(--color-muted);
    }
  `,
})
export class IntervalTableComponent {
  readonly caption = input.required<string>();
  readonly rows = input.required<ProducerInterval[]>();
}
