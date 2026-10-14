import { TestBed } from '@angular/core/testing';
import { MetricCardsComponent } from './metric-cards.component';
import { SizingMetrics } from '../../core/models/machine-data.model';

const METRICS: SizingMetrics = {
  cpu: '4 Core',
  cpuValue: 4000,
  gpu: 'RTX4060',
  gpuValue: 8192,
  ram: '16 GB',
  ramValue: 16384,
  memoryConsumption: '50%',
  memoryConsumptionValue: 50,
};

describe('MetricCardsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetricCardsComponent],
    }).compileComponents();
  });

  it('renders CPU, GPU, and memory consumption in GB', async () => {
    const fixture = TestBed.createComponent(MetricCardsComponent);
    fixture.componentInstance.metrics = METRICS;
    await fixture.whenStable();
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('4 Core');
    expect(text).toContain('RTX4060');
    expect(text).toContain('16 GB');
    expect(text).toContain('Memory Consumption');
    expect(text).not.toContain('RAM');
    expect(text).not.toContain('50%');
  });
});
