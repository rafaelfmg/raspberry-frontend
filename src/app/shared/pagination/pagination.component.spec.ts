import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginationComponent } from './pagination.component';

describe('PaginationComponent', () => {
  let fixture: ComponentFixture<PaginationComponent>;
  let element: HTMLElement;
  let emitted: number[];

  function render(page: number, totalPages: number): void {
    fixture.componentRef.setInput('page', page);
    fixture.componentRef.setInput('totalPages', totalPages);
    fixture.detectChanges();
  }

  const pageLabels = () =>
    Array.from(element.querySelectorAll('.pagination__page')).map((button) => button.textContent?.trim());

  const button = (label: string) => element.querySelector<HTMLButtonElement>(`button[aria-label="${label}"]`)!;

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginationComponent);
    element = fixture.nativeElement;
    emitted = [];
    fixture.componentInstance.pageChange.subscribe((page) => emitted.push(page));
  });

  it('renders nothing when there is a single page', () => {
    render(0, 1);

    expect(element.querySelector('nav')).toBeNull();
  });

  it('shows a window of 5 pages starting at the first page', () => {
    render(0, 10);

    expect(pageLabels()).toEqual(['1', '2', '3', '4', '5']);
  });

  it('centers the window on the current page', () => {
    render(5, 10);

    expect(pageLabels()).toEqual(['4', '5', '6', '7', '8']);
  });

  it('keeps the window inside the last pages', () => {
    render(9, 10);

    expect(pageLabels()).toEqual(['6', '7', '8', '9', '10']);
  });

  it('shows fewer buttons when there are fewer than 5 pages', () => {
    render(0, 3);

    expect(pageLabels()).toEqual(['1', '2', '3']);
  });

  it('marks the current page as active', () => {
    render(2, 10);

    const active = element.querySelector('.pagination__page.active');
    expect(active?.textContent?.trim()).toBe('3');
    expect(active?.getAttribute('aria-current')).toBe('page');
  });

  it('disables first/previous on the first page', () => {
    render(0, 10);

    expect(button('First page').disabled).toBeTrue();
    expect(button('Previous page').disabled).toBeTrue();
    expect(button('Next page').disabled).toBeFalse();
  });

  it('disables next/last on the last page', () => {
    render(9, 10);

    expect(button('Next page').disabled).toBeTrue();
    expect(button('Last page').disabled).toBeTrue();
    expect(button('Previous page').disabled).toBeFalse();
  });

  it('emits the target page (0-based) for each navigation button', () => {
    render(5, 10);

    button('First page').click();
    button('Previous page').click();
    button('Next page').click();
    button('Last page').click();
    element.querySelectorAll<HTMLButtonElement>('.pagination__page')[0].click(); // página 4 -> índice 3

    expect(emitted).toEqual([0, 4, 6, 9, 3]);
  });

  it('does not emit when the current page is clicked', () => {
    render(2, 10);

    element.querySelector<HTMLButtonElement>('.pagination__page.active')!.click();

    expect(emitted).toEqual([]);
  });
});
