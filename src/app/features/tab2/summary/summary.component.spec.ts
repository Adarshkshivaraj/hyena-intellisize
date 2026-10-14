import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SummaryComponent } from './summary.component';
import { routes } from '../../../app.routes';

describe('SummaryComponent', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [SummaryComponent],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  it('creates the component', () => {
    const fixture = TestBed.createComponent(SummaryComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('exposes aggregated metrics for the active resource', () => {
    const fixture = TestBed.createComponent(SummaryComponent);
    const metrics = fixture.componentInstance.resourceService.activeResourceMetrics();
    expect(metrics).toBeDefined();
    expect(typeof metrics.memoryConsumption).toBe('string');
  });
});
