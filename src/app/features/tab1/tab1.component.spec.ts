import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Tab1Component } from './tab1.component';
import { routes } from '../../app.routes';

describe('Tab1Component', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Tab1Component],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  it('creates the component with a default selection', () => {
    const fixture = TestBed.createComponent(Tab1Component);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
    expect(component.currentMachinePlugins().length).toBeGreaterThan(0);
    expect(component.selectedPlugin()).not.toBeNull();
  });

  it('updates plugins when the machine changes', () => {
    const fixture = TestBed.createComponent(Tab1Component);
    const component = fixture.componentInstance;
    component.onMachineChange('SRV-WEB-02');
    expect(component.resourceService.tab1SelectedMachine()).toBe('SRV-WEB-02');
    expect(component.currentMachinePlugins().some((p) => p.name === 'Cache Manager')).toBe(true);
  });
});
