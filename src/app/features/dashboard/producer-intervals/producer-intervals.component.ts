import { Component, inject } from '@angular/core';

import { MovieService } from '../../../core/services/movie.service';
import { PanelComponent } from '../../../shared/panel/panel.component';
import { loadRemote } from '../../../shared/remote-state/remote-state';
import { IntervalTableComponent } from './interval-table.component';

@Component({
  selector: 'app-producer-intervals',
  imports: [PanelComponent, IntervalTableComponent],
  template: `
    <app-panel
      heading="Producers with longest and shortest interval between wins"
      [loading]="state.loading()"
      [error]="state.error()"
    >
      @if (state.data(); as intervals) {
        <app-interval-table caption="Maximum" [rows]="intervals.max" />
        <app-interval-table caption="Minimum" [rows]="intervals.min" />
      }
    </app-panel>
  `,
})
export class ProducerIntervalsComponent {
  private readonly movies = inject(MovieService);
  protected readonly state = loadRemote(this.movies.getProducerIntervals());
}
