import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoGrid } from './photo-grid';
import { Photo } from '../../da/models/photo.model';

describe('PhotoGrid', () => {
  let component: PhotoGrid;
  let fixture: ComponentFixture<PhotoGrid>;

  const photos: Photo[] = [
    {
      id: '1',
      thumbnailUrl: 'https://picsum.photos/seed/1/200/300',
      fullSizeUrl: 'https://picsum.photos/seed/1/600/800',
    },
    {
      id: '2',
      thumbnailUrl: 'https://picsum.photos/seed/2/200/300',
      fullSizeUrl: 'https://picsum.photos/seed/2/600/800',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoGrid],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoGrid);
    fixture.componentRef.setInput('photos', photos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should render photo cards', () => {
    const cards = fixture.nativeElement.querySelectorAll('app-photo-card');

    expect(cards.length).toBe(photos.length);
  });

  it('should emit clicked photo', () => {
    const emitSpy = vi.spyOn(component.photoClicked, 'emit');
    const firstButton = fixture.nativeElement.querySelector('button') as HTMLButtonElement;

    firstButton.click();

    expect(emitSpy).toHaveBeenCalledWith(photos[0]);
  });
});
