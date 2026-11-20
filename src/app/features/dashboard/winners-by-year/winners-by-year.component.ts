import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Movie } from '../../../core/models/movie.model';
import { MovieService } from '../../../core/services/movie.service';
import { PanelComponent } from '../../../shared/panel/panel.component';

const YEAR_PATTERN = /^\d{4}$/;

@Component({
  selector: 'app-winners-by-year',
  imports: [PanelComponent, ReactiveFormsModule],
  templateUrl: './winners-by-year.component.html',
  styleUrl: './winners-by-year.component.css',
})
export class WinnersByYearComponent {
  private readonly movies = inject(MovieService);
  private readonly destroyRef = inject(DestroyRef);
  private searchSubscription?: Subscription;

  protected readonly yearControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.pattern(YEAR_PATTERN)],
  });

  /** `null` enquanto nenhuma busca foi feita. */
  protected readonly winners = signal<Movie[] | null>(null);
  protected readonly searchedYear = signal('');
  protected readonly loading = signal(false);
  protected readonly error = signal(false);

  protected search(): void {
    if (this.yearControl.invalid) {
      this.yearControl.markAsTouched();
      return;
    }

    const year = this.yearControl.value;
    this.searchSubscription?.unsubscribe();
    this.loading.set(true);
    this.error.set(false);

    this.searchSubscription = this.movies
      .getWinnersByYear(Number(year))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (winners) => {
          this.searchedYear.set(year);
          this.winners.set(winners);
          this.loading.set(false);
        },
        error: () => {
          this.error.set(true);
          this.loading.set(false);
        },
      });
  }
}
