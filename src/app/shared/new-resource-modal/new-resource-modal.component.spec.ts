import { TestBed } from '@angular/core/testing';
import { NewResourceModalComponent } from './new-resource-modal.component';

describe('NewResourceModalComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewResourceModalComponent],
    }).compileComponents();
  });

  it('does not emit create for a blank name', () => {
    const fixture = TestBed.createComponent(NewResourceModalComponent);
    const component = fixture.componentInstance;
    const spy = vi.fn();
    component.create.subscribe(spy);

    component.resourceName = '   ';
    component.submit();

    expect(spy).not.toHaveBeenCalled();
  });

  it('emits create and dismiss for a valid name', () => {
    const fixture = TestBed.createComponent(NewResourceModalComponent);
    const component = fixture.componentInstance;
    const createSpy = vi.fn();
    const dismissSpy = vi.fn();
    component.create.subscribe(createSpy);
    component.dismiss.subscribe(dismissSpy);

    component.resourceName = '  Prod Cluster  ';
    component.submit();

    expect(createSpy).toHaveBeenCalledWith('Prod Cluster');
    expect(dismissSpy).toHaveBeenCalled();
  });

  it('emits dismiss on cancel', () => {
    const fixture = TestBed.createComponent(NewResourceModalComponent);
    const component = fixture.componentInstance;
    const dismissSpy = vi.fn();
    component.dismiss.subscribe(dismissSpy);

    component.cancel();

    expect(dismissSpy).toHaveBeenCalled();
  });
});
