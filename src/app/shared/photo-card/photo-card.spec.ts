import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoCard } from './photo-card';

describe('PhotoCard', () => {
  let component: PhotoCard;
  let fixture: ComponentFixture<PhotoCard>;

  const photo1 = {
    id: '1',
    width: 200,
    height: 300,
    thumbnailUrl: 'https://picsum.photos/id/1/200/300',
    fullSizeUrl: 'https://picsum.photos/id/1/600/800',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoCard],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoCard);
    fixture.componentRef.setInput('photo', photo1);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render photo thumbnail', () => {
    const image = fixture.nativeElement.querySelector('img') as HTMLImageElement;

    expect(image.src).toContain(photo1.thumbnailUrl);
  });

  it('should emit photoClick when clicked', () => {
    const emitSpy = vi.spyOn(component.photoClicked, 'emit');
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;

    button.click();

    expect(emitSpy).toHaveBeenCalledWith(photo1);
  });
});
