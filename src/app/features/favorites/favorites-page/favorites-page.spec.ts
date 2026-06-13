import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoritesPage } from './favorites-page';
import { provideRouter, Router } from '@angular/router';
import { signal } from '@angular/core';
import { Photo } from '../../../da/models/photo.model';
import { FavoritesService } from '../../../da/services/favorites.service';
import { photo1, photo2 } from '../../../shared/util/mocks/photos.mock';

describe('FavoritesPage', () => {
  let component: FavoritesPage;
  let fixture: ComponentFixture<FavoritesPage>;
  let router: Router;

  const photos: Photo[] = [photo1, photo2];

  const favorites = signal<Photo[]>([]);

  const favoritesServiceMock = {
    favorites: favorites.asReadonly(),
    favoritesCount: () => favorites().length,
    isEmpty: () => favorites().length === 0,
  };

  beforeEach(async () => {
    favorites.set([]);

    await TestBed.configureTestingModule({
      imports: [FavoritesPage],
      providers: [
        provideRouter([]),
        {
          provide: FavoritesService,
          useValue: favoritesServiceMock,
        },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(FavoritesPage);
    component = fixture.componentInstance;
  });

  it('should render empty state when favorites are empty', () => {
    fixture.detectChanges();

    const textContent = fixture.nativeElement.textContent;

    expect(textContent).toContain('No favorite photos yet');
    expect(textContent).toContain('Browse photos');
  });

  it('should render photo grid when favorites exist', () => {
    favorites.set(photos);

    fixture.detectChanges();

    const photoGrid = fixture.nativeElement.querySelector('app-photo-grid');

    expect(photoGrid).toBeTruthy();
  });

  it('should render photo grid when favorites exist', () => {
    favorites.set(photos);

    fixture.detectChanges();

    const photoCards = fixture.nativeElement.querySelectorAll('app-photo-card');

    expect(photoCards.length).toBe(photos.length);
  });

  it('should navigate to photo details when photo is clicked', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');

    fixture.detectChanges();

    component.openPhoto(photos[0]);

    expect(navigateSpy).toHaveBeenCalledWith(['/photos', photos[0].id]);
  });
});
