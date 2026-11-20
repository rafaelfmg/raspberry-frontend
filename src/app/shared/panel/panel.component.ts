import { Component, input } from '@angular/core';

/** Cartão com título que exibe estados de carregamento e erro no lugar do conteúdo. */
@Component({
  selector: 'app-panel',
  template: `
    <section class="panel">
      <h2 class="panel__title">{{ heading() }}</h2>
      @if (loading()) {
        <p class="state" role="status">Loading...</p>
      } @else if (error()) {
        <p class="state state--error" role="alert">Could not load the data. Please try again later.</p>
      } @else {
        <ng-content />
      }
    </section>
  `,
  styles: `
    .panel {
      height: 100%;
      padding: 16px;
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
      background: var(--color-surface);
      overflow-x: auto;
    }

    .panel__title {
      margin-bottom: 12px;
      font-size: 15px;
      font-weight: 600;
    }
  `,
})
export class PanelComponent {
  readonly heading = input.required<string>();
  readonly loading = input(false);
  readonly error = input(false);
}
