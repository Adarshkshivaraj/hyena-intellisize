import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ResourceService } from '../../../core/services/resource.service';
import { MetricCardsComponent } from '../../../shared/metric-cards/metric-cards.component';

/** Tab 2 / Summary: aggregated sizing plus the selected plugins per machine. */
@Component({
  selector: 'app-summary',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MetricCardsComponent],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss',
})
export class SummaryComponent {
  readonly resourceService = inject(ResourceService);
  private readonly router = inject(Router);

  backToWorkspace(): void {
    this.router.navigate(['/tab2/workspace']);
  }
}
