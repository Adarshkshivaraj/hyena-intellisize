import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Tab2Component } from './tab2.component';
import { routes } from '../../app.routes';

describe('Tab2Component', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Tab2Component],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  it('creates the component with the sidebar open', () => {
    const fixture = TestBed.createComponent(Tab2Component);
    expect(fixture.componentInstance.isSidebarOpen()).toBe(true);
  });

  it('toggles the sidebar', () => {
    const fixture = TestBed.createComponent(Tab2Component);
    fixture.componentInstance.toggleSidebar();
    expect(fixture.componentInstance.isSidebarOpen()).toBe(false);
  });

  it('selects a resource', () => {
    const fixture = TestBed.createComponent(Tab2Component);
    const component = fixture.componentInstance;
    const target = component.resourceService.resources()[1];
    component.selectResource(target.id);
    expect(component.resourceService.activeResourceId()).toBe(target.id);
  });
});
