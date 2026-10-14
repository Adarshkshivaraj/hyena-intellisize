import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ResourceService } from '../../../core/services/resource.service';
import { NewResourceModalComponent } from '../../../shared/new-resource-modal/new-resource-modal.component';

/** Tab 2 / Workspace: select plugins per machine for the active resource. */
@Component({
  selector: 'app-workspace',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NewResourceModalComponent],
  templateUrl: './workspace.component.html',
  styleUrl: './workspace.component.scss',
})
export class WorkspaceComponent {
  readonly resourceService = inject(ResourceService);
  private readonly router = inject(Router);

  readonly showModal = signal<boolean>(false);

  togglePlugin(machineName: string, pluginName: string): void {
    this.resourceService.togglePlugin(machineName, pluginName);
  }

  toggleAllPlugins(machineName: string): void {
    this.resourceService.toggleAllPlugins(machineName);
  }

  openModal(): void {
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  createResource(name: string): void {
    this.resourceService.createResource(name);
  }

  goToSummary(): void {
    this.router.navigate(['/tab2/summary']);
  }
}
