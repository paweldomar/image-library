import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoGrid } from './photo-grid';
import { Photo } from '../../da/models/photo.model';

import { photo1, photo2 } from '../util/mocks/photos.mock';

describe('PhotoGrid', () => {
  let component: PhotoGrid;
  let fixture: ComponentFixture<PhotoGrid>;

  const photos: Photo[] = [photo1, photo2];

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
