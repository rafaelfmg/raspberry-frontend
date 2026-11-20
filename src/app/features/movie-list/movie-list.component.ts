import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subscription, debounceTime, distinctUntilChanged, filter, map } from 'rxjs';

import { Movie, MovieQuery, Page } from '../../core/models/movie.model';
import { MovieService } from '../../core/services/movie.service';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { PanelComponent } from '../../shared/panel/panel.component';

type WinnerFilter = '' | 'true' | 'false';

const PAGE_SIZE = 15;
const YEAR_FILTER_DEBOUNCE_MS = 400;
const YEAR_PATTERN = /^\d{4}$/;

@Component({
  selector: 'app-movie-list',
  imports: [ReactiveFormsModule, PanelComponent, PaginationComponent],
  templateUrl: './movie-list.component.html',
  styleUrl: './movie-list.component.css',
})
export class MovieListComponent implements OnInit {
  private readonly movies = inject(MovieService);
  private readonly destroyRef = inject(DestroyRef);
  private loadSubscription?: Subscription;
  private currentPage = 0;

  protected readonly yearControl = new FormControl('', { nonNullable: true });
  protected readonly winnerControl = new FormControl<WinnerFilter>('', { nonNullable: true });

  protected readonly result = signal<Page<Movie> | null>(null);
  protected readonly loading = signal(false);
  protected readonly error = signal(false);

  ngOnInit(): void {
    // O filtro de ano só é aplicado com 4 dígitos (ou vazio), após uma pausa na digitação.
    this.yearControl.valueChanges
      .pipe(
        debounceTime(YEAR_FILTER_DEBOUNCE_MS),
        map((value) => value.trim()),
        filter((value) => value === '' || YEAR_PATTERN.test(value)),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.applyFilters());

    this.winnerControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.applyFilters());

    this.load();
  }

  protected onPageChange(page: number): void {
    this.currentPage = page;
    this.load();
  }

  private applyFilters(): void {
    this.currentPage = 0;
    this.load();
  }

  private load(): void {
    this.loadSubscription?.unsubscribe();
    this.loading.set(true);
    this.error.set(false);

    this.loadSubscription = this.movies.getMovies(this.buildQuery()).subscribe({
      next: (page) => {
        this.result.set(page);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  private buildQuery(): MovieQuery {
    const query: MovieQuery = { page: this.currentPage, size: PAGE_SIZE };

    const year = this.yearControl.value.trim();
    if (YEAR_PATTERN.test(year)) {
      query.year = Number(year);
    }

    const winner = this.winnerControl.value;
    if (winner !== '') {
      query.winner = winner === 'true';
    }

    return query;
  }
}
