import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SizingMetrics } from '../../core/models/machine-data.model';

/** Presentational component rendering the four sizing metric cards. */
@Component({
  selector: 'app-metric-cards',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './metric-cards.component.html',
  styleUrl: './metric-cards.component.scss',
})
export class MetricCardsComponent {
  @Input({ required: true }) metrics!: SizingMetrics;
}
