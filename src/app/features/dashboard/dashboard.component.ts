import { Component } from '@angular/core';

import { ProducerIntervalsComponent } from './producer-intervals/producer-intervals.component';
import { TopStudiosComponent } from './top-studios/top-studios.component';
import { WinnersByYearComponent } from './winners-by-year/winners-by-year.component';
import { YearsWithMultipleWinnersComponent } from './years-with-multiple-winners/years-with-multiple-winners.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    YearsWithMultipleWinnersComponent,
    TopStudiosComponent,
    ProducerIntervalsComponent,
    WinnersByYearComponent,
  ],
  template: `
    <div class="dashboard">
      <app-years-with-multiple-winners />
      <app-top-studios />
      <app-producer-intervals />
      <app-winners-by-year />
    </div>
  `,
  styles: `
    .dashboard {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 16px;
    }

    @media (max-width: 1023px) {
      .dashboard {
        grid-template-columns: minmax(0, 1fr);
      }
    }
  `,
})
export class DashboardComponent {}
