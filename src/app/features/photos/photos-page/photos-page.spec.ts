import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotosPage } from './photos-page';
import { Photo } from '../../../da/models/photo.model';
import { Observable, of, throwError } from 'rxjs';
import { PhotoApiService } from '../../../da/services/photo-api.service';
import { FavoritesService } from '../../../da/services/favorites.service';
import { MatSnackBar } from '@angular/material/snack-bar';

class MockIntersectionObserver {
  static latestInstance: MockIntersectionObserver | undefined;

  readonly observe = vi.fn();
  readonly disconnect = vi.fn();

  private readonly callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    MockIntersectionObserver.latestInstance = this;
  }

  triggerIntersecting(): void {
    this.callback(
      [
        {
          isIntersecting: true,
        } as IntersectionObserverEntry,
      ],
      this as unknown as IntersectionObserver,
    );
  }

  triggerNotIntersecting(): void {
    this.callback(
      [
        {
          isIntersecting: false,
        } as IntersectionObserverEntry,
      ],
      this as unknown as IntersectionObserver,
    );
  }
}

describe('PhotosPage', () => {
  let component: PhotosPage;
  let fixture: ComponentFixture<PhotosPage>;

  let photoApiServiceMock: {
    getPhotos: ReturnType<typeof vi.fn>;
  };

  let favoritesServiceMock: {
    add: ReturnType<typeof vi.fn>;
  };

  let snackBarMock: {
    open: ReturnType<typeof vi.fn>;
  };

  const photo1: Photo = {
    id: 'photo-1',
    thumbnailUrl: 'https://picsum.photos/seed/photo-1/200/300',
    fullSizeUrl: 'https://picsum.photos/seed/photo-1/600/800',
    width: 200,
    height: 300,
  };

  const photo2: Photo = {
    id: 'photo-2',
    thumbnailUrl: 'https://picsum.photos/seed/photo-2/200/300',
    fullSizeUrl: 'https://picsum.photos/seed/photo-2/600/800',
    width: 200,
    height: 300,
  };

  const photo3: Photo = {
    id: 'photo-3',
    thumbnailUrl: 'https://picsum.photos/seed/photo-3/200/300',
    fullSizeUrl: 'https://picsum.photos/seed/photo-3/600/800',
    width: 200,
    height: 300,
  };

  beforeEach(async () => {
    MockIntersectionObserver.latestInstance = undefined;

    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);

    photoApiServiceMock = {
      getPhotos: vi.fn(() => of([photo1, photo2])),
    };

    favoritesServiceMock = {
      add: vi.fn(),
    };

    snackBarMock = {
      open: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [PhotosPage],
      providers: [
        {
          provide: PhotoApiService,
          useValue: photoApiServiceMock,
        },
        {
          provide: FavoritesService,
          useValue: favoritesServiceMock,
        },
        {
          provide: MatSnackBar,
          useValue: snackBarMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotosPage);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should load initial photos on init', () => {
    fixture.detectChanges();

    expect(photoApiServiceMock.getPhotos).toHaveBeenCalledWith(component.pageSize);
    expect(component.photos()).toEqual([photo1, photo2]);
    expect(component.isLoading()).toBe(false);
    expect(component.error()).toBeNull();
  });

  it('should render loaded photos', () => {
    fixture.detectChanges();

    const photoCards = fixture.nativeElement.querySelectorAll('app-photo-card');

    expect(photoCards.length).toBe(2);
  });

  it('should append photos when loadMore is called again', () => {
    fixture.detectChanges();

    photoApiServiceMock.getPhotos.mockReturnValueOnce(of([photo3]));

    component.loadMore();

    expect(component.photos()).toEqual([photo1, photo2, photo3]);
  });

  it('should not load more photos when already loading', () => {
    photoApiServiceMock.getPhotos.mockReturnValueOnce(new Observable<Photo[]>());

    fixture.detectChanges();

    expect(component.isLoading()).toBe(true);

    component.loadMore();

    expect(photoApiServiceMock.getPhotos).toHaveBeenCalledTimes(1);
  });

  it('should set error when loading photos fails', () => {
    photoApiServiceMock.getPhotos.mockReturnValueOnce(throwError(() => new Error('API error')));

    fixture.detectChanges();

    expect(component.error()).toBe('Could not load photos. Please try again.');
    expect(component.isLoading()).toBe(false);
  });

  it('should allow retry after loading error', () => {
    photoApiServiceMock.getPhotos.mockReturnValueOnce(throwError(() => new Error('API error')));

    fixture.detectChanges();

    expect(component.error()).toBe('Could not load photos. Please try again.');

    photoApiServiceMock.getPhotos.mockReturnValueOnce(of([photo1]));

    component.loadMore();

    expect(component.error()).toBeNull();
    expect(component.photos()).toEqual([photo1]);
  });

  it('should add photo to favorites', () => {
    fixture.detectChanges();

    component.addToFavorites(photo1);

    expect(favoritesServiceMock.add).toHaveBeenCalledWith(photo1);
  });

  it('should add photo to favorites when photo card is clicked', () => {
    fixture.detectChanges();

    const photo1Button = fixture.nativeElement.querySelector(
      'app-photo-card button',
    ) as HTMLButtonElement | null;

    expect(photo1Button).toBeTruthy();

    photo1Button?.click();

    expect(favoritesServiceMock.add).toHaveBeenCalledWith(photo1);
  });

  it('should create IntersectionObserver after view init', () => {
    fixture.detectChanges();

    expect(MockIntersectionObserver.latestInstance).toBeTruthy();
  });

  it('should observe scroll anchor', () => {
    fixture.detectChanges();

    const observer = MockIntersectionObserver.latestInstance;

    expect(observer).toBeTruthy();
    expect(observer?.observe).toHaveBeenCalled();
  });

  it('should load more photos when scroll anchor intersects', () => {
    fixture.detectChanges();

    photoApiServiceMock.getPhotos.mockClear();
    photoApiServiceMock.getPhotos.mockReturnValueOnce(of([photo3]));

    MockIntersectionObserver.latestInstance?.triggerIntersecting();

    expect(photoApiServiceMock.getPhotos).toHaveBeenCalledWith(component.pageSize);
    expect(component.photos()).toEqual([photo1, photo2, photo3]);
  });

  it('should not load more photos when scroll anchor does not intersect', () => {
    fixture.detectChanges();

    photoApiServiceMock.getPhotos.mockClear();

    MockIntersectionObserver.latestInstance?.triggerNotIntersecting();

    expect(photoApiServiceMock.getPhotos).not.toHaveBeenCalled();
  });

  it('should disconnect IntersectionObserver on destroy', () => {
    fixture.detectChanges();

    const observer = MockIntersectionObserver.latestInstance;

    fixture.destroy();

    expect(observer?.disconnect).toHaveBeenCalled();
  });
});
