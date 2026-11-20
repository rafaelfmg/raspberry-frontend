import { Component, computed, input, output } from '@angular/core';

const MAX_VISIBLE_PAGES = 5;

/** Paginação com primeira/anterior/números/próxima/última. Páginas são indexadas a partir de 0. */
@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css',
})
export class PaginationComponent {
  readonly page = input.required<number>();
  readonly totalPages = input.required<number>();
  readonly pageChange = output<number>();

  protected readonly isFirst = computed(() => this.page() <= 0);
  protected readonly isLast = computed(() => this.page() >= this.totalPages() - 1);

  /** Janela de até 5 páginas centrada na página atual. */
  protected readonly visiblePages = computed(() => {
    const total = this.totalPages();
    const end = Math.min(total, Math.max(0, this.page() - Math.floor(MAX_VISIBLE_PAGES / 2)) + MAX_VISIBLE_PAGES);
    const start = Math.max(0, end - MAX_VISIBLE_PAGES);
    return Array.from({ length: end - start }, (_, index) => start + index);
  });

  protected goTo(target: number): void {
    if (target < 0 || target >= this.totalPages() || target === this.page()) {
      return;
    }
    this.pageChange.emit(target);
  }
}
