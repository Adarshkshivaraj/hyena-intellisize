import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ResourceService } from '../../core/services/resource.service';
import { MetricCardsComponent } from '../../shared/metric-cards/metric-cards.component';
import { PluginDetail } from '../../core/models/machine-data.model';

/** Tab 1: pick a machine + plugin and view its sizing metrics. */
@Component({
  selector: 'app-tab1',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, MetricCardsComponent],
  templateUrl: './tab1.component.html',
  styleUrl: './tab1.component.scss',
})
export class Tab1Component {
  readonly resourceService = inject(ResourceService);

  readonly currentMachinePlugins = computed<PluginDetail[]>(
    () =>
      this.resourceService
        .machines()
        .find((m) => m.name === this.resourceService.tab1SelectedMachine())?.plugins ?? [],
  );

  readonly selectedPlugin = computed<PluginDetail | null>(
    () =>
      this.currentMachinePlugins().find(
        (p) => p.name === this.resourceService.tab1SelectedPlugin(),
      ) ?? null,
  );

  onMachineChange(machineName: string): void {
    this.resourceService.setTab1Machine(machineName);
  }

  onPluginChange(pluginName: string): void {
    this.resourceService.setTab1Plugin(pluginName);
  }
}
