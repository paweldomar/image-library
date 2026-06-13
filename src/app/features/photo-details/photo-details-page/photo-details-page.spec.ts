import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoDetailsPage } from './photo-details-page';
import { ActivatedRoute, convertToParamMap, provideRouter, Router } from '@angular/router';
import { FavoritesService } from '../../../da/services/favorites.service';

import { photo1 } from '../../../shared/util/mocks/photos.mock';

describe('PhotoDetailsPage', () => {
  let component: PhotoDetailsPage;
  let fixture: ComponentFixture<PhotoDetailsPage>;
  let router: Router;

  let favoritesServiceMock: {
    getById: ReturnType<typeof vi.fn>;
    remove: ReturnType<typeof vi.fn>;
  };

  function configureTestingModule(photoId: string): Promise<void> {
    favoritesServiceMock = {
      getById: vi.fn(),
      remove: vi.fn(() => true),
    };

    return TestBed.configureTestingModule({
      imports: [PhotoDetailsPage],
      providers: [
        provideRouter([]),
        {
          provide: FavoritesService,
          useValue: favoritesServiceMock,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({
                id: photoId,
              }),
            },
          },
        },
      ],
    }).compileComponents();
  }

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should render photo when it exists', async () => {
    await configureTestingModule(photo1.id);

    favoritesServiceMock.getById.mockReturnValue(photo1);

    fixture = TestBed.createComponent(PhotoDetailsPage);
    fixture.detectChanges();

    const image = fixture.nativeElement.querySelector('img') as HTMLImageElement | null;

    expect(image).toBeTruthy();
    expect(image?.getAttribute('src')).toBe(photo1.fullSizeUrl);
    expect(image?.getAttribute('alt')).toBe(`Favorite photo ${photo1.id}`);
  });

  it('should render not found state when photo does not exist', async () => {
    await configureTestingModule('missing-photo');

    favoritesServiceMock.getById.mockReturnValue(undefined);

    fixture = TestBed.createComponent(PhotoDetailsPage);
    fixture.detectChanges();

    const textContent = fixture.nativeElement.textContent;

    expect(textContent).toContain('Photo not found');
    expect(textContent).toContain('This photo is not available in your favorites library');
  });

  it('should remove photo from favorites and navigate back to favorites', async () => {
    await configureTestingModule(photo1.id);

    favoritesServiceMock.getById.mockReturnValue(photo1);

    router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');

    fixture = TestBed.createComponent(PhotoDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.removeFromFavorites();

    expect(favoritesServiceMock.remove).toHaveBeenCalledWith(photo1);
    expect(navigateSpy).toHaveBeenCalledWith(['/favorites']);
  });
});
