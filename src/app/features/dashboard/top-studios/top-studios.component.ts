import { Component, inject } from '@angular/core';

import { MovieService } from '../../../core/services/movie.service';
import { PanelComponent } from '../../../shared/panel/panel.component';
import { loadRemote } from '../../../shared/remote-state/remote-state';

@Component({
  selector: 'app-top-studios',
  imports: [PanelComponent],
  template: `
    <app-panel heading="Top 3 studios with winners" [loading]="state.loading()" [error]="state.error()">
      <table class="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Win Count</th>
          </tr>
        </thead>
        <tbody>
          @for (studio of state.data() ?? []; track studio.name) {
            <tr>
              <td>{{ studio.name }}</td>
              <td>{{ studio.winCount }}</td>
            </tr>
          } @empty {
            <tr>
              <td class="empty" colspan="2">No studios with wins.</td>
            </tr>
          }
        </tbody>
      </table>
    </app-panel>
  `,
})
export class TopStudiosComponent {
  private readonly movies = inject(MovieService);
  protected readonly state = loadRemote(this.movies.getTopStudios());
}
