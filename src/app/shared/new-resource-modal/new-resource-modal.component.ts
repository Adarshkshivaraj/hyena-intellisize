import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

/** Modal dialog that collects a name for a new resource. */
@Component({
  selector: 'app-new-resource-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  templateUrl: './new-resource-modal.component.html',
  styleUrl: './new-resource-modal.component.scss',
})
export class NewResourceModalComponent implements AfterViewInit {
  @Output() dismiss = new EventEmitter<void>();
  @Output() create = new EventEmitter<string>();

  @ViewChild('nameInput') nameInputField?: ElementRef<HTMLInputElement>;

  resourceName = '';

  ngAfterViewInit(): void {
    setTimeout(() => this.nameInputField?.nativeElement.focus(), 50);
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.cancel();
    }
  }

  cancel(): void {
    this.dismiss.emit();
  }

  submit(): void {
    const name = this.resourceName.trim();
    if (!name) {
      return;
    }
    this.create.emit(name);
    this.dismiss.emit();
  }
}
