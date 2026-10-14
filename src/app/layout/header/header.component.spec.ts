import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HeaderComponent } from './header.component';
import { routes } from '../../app.routes';

describe('HeaderComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  it('creates the component', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders two tab navigation links', async () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    await fixture.whenStable();
    const links = (fixture.nativeElement as HTMLElement).querySelectorAll('.tab-btn');
    expect(links.length).toBe(2);
  });
});
