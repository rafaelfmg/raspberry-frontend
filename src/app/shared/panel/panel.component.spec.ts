import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelComponent } from './panel.component';

@Component({
  imports: [PanelComponent],
  template: `
    <app-panel heading="My panel" [loading]="loading" [error]="error">
      <p class="projected">content</p>
    </app-panel>
  `,
})
class HostComponent {
  loading = false;
  error = false;
}

describe('PanelComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let element: HTMLElement;

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    element = fixture.nativeElement;
  });

  it('renders the heading and the projected content', () => {
    fixture.detectChanges();

    expect(element.querySelector('h2')?.textContent).toContain('My panel');
    expect(element.querySelector('.projected')).not.toBeNull();
  });

  it('shows a loading message instead of the content', () => {
    fixture.componentInstance.loading = true;
    fixture.detectChanges();

    expect(element.querySelector('[role="status"]')?.textContent).toContain('Loading');
    expect(element.querySelector('.projected')).toBeNull();
  });

  it('shows an error message instead of the content', () => {
    fixture.componentInstance.error = true;
    fixture.detectChanges();

    expect(element.querySelector('[role="alert"]')).not.toBeNull();
    expect(element.querySelector('.projected')).toBeNull();
  });
});
