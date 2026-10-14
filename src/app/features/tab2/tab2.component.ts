import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ResourceService } from '../../core/services/resource.service';

/** Tab 2 layout: resource sidebar plus a routed content area. */
@Component({
  selector: 'app-tab2',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet],
  templateUrl: './tab2.component.html',
  styleUrl: './tab2.component.scss',
})
export class Tab2Component {
  readonly resourceService = inject(ResourceService);
  readonly isSidebarOpen = signal<boolean>(true);

  toggleSidebar(): void {
    this.isSidebarOpen.update((open) => !open);
  }

  selectResource(resourceId: string): void {
    this.resourceService.selectResource(resourceId);
  }

  deleteResource(event: MouseEvent, resourceId: string): void {
    event.stopPropagation();
    this.resourceService.deleteResource(resourceId);
  }
}
