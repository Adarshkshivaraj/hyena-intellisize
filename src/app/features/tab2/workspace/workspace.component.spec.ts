import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { WorkspaceComponent } from './workspace.component';
import { routes } from '../../../app.routes';

describe('WorkspaceComponent', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [WorkspaceComponent],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  it('creates the component', () => {
    const fixture = TestBed.createComponent(WorkspaceComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('opens and closes the modal', () => {
    const fixture = TestBed.createComponent(WorkspaceComponent);
    const component = fixture.componentInstance;
    expect(component.showModal()).toBe(false);
    component.openModal();
    expect(component.showModal()).toBe(true);
    component.closeModal();
    expect(component.showModal()).toBe(false);
  });

  it('creates a resource via the service', () => {
    const fixture = TestBed.createComponent(WorkspaceComponent);
    const component = fixture.componentInstance;
    const before = component.resourceService.resources().length;
    component.createResource('New One');
    expect(component.resourceService.resources().length).toBe(before + 1);
  });
});
