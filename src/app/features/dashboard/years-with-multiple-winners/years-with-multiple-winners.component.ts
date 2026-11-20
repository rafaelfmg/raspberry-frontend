import { Component, inject } from '@angular/core';

import { MovieService } from '../../../core/services/movie.service';
import { PanelComponent } from '../../../shared/panel/panel.component';
import { loadRemote } from '../../../shared/remote-state/remote-state';

@Component({
  selector: 'app-years-with-multiple-winners',
  imports: [PanelComponent],
  template: `
    <app-panel heading="List years with multiple winners" [loading]="state.loading()" [error]="state.error()">
      <table class="data-table">
        <thead>
          <tr>
            <th>Year</th>
            <th>Win Count</th>
          </tr>
        </thead>
        <tbody>
          @for (item of state.data() ?? []; track item.year) {
            <tr>
              <td>{{ item.year }}</td>
              <td>{{ item.winnerCount }}</td>
            </tr>
          } @empty {
            <tr>
              <td class="empty" colspan="2">No years with multiple winners.</td>
            </tr>
          }
        </tbody>
      </table>
    </app-panel>
  `,
})
export class YearsWithMultipleWinnersComponent {
  private readonly movies = inject(MovieService);
  protected readonly state = loadRemote(this.movies.getYearsWithMultipleWinners());
}
