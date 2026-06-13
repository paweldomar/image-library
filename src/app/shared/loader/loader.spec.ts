import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Loader } from './loader';

describe('Loader', () => {
  let fixture: ComponentFixture<Loader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Loader],
    }).compileComponents();

    fixture = TestBed.createComponent(Loader);
    await fixture.whenStable();
  });

  it('should initialize mat-spinner', () => {
    const spinner = Array.from(
      fixture.nativeElement.querySelectorAll('mat-spinner'),
    )[0] as HTMLAnchorElement;
    const placeholder = Array.from(
      fixture.nativeElement.querySelectorAll('span') as HTMLAnchorElement[],
    )[0].textContent?.trim();

    expect(spinner.nodeName).toEqual('MAT-SPINNER');
    expect(placeholder).toEqual('Loading...');
  });
});
