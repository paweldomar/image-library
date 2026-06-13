import { FavoritesService } from './favorites.service';
import { Photo } from '../models/photo.model';
import { TestBed } from '@angular/core/testing';

describe('FavoritesService', () => {
  let service: FavoritesService;

  const photo1: Photo = {
    id: '1',
    thumbnailUrl: 'https://picsum.photos/seed/1/200/300',
    fullSizeUrl: 'https://picsum.photos/seed/1/600/800',
  };

  const photo2: Photo = {
    id: '2',
    thumbnailUrl: 'https://picsum.photos/seed/2/200/300',
    fullSizeUrl: 'https://picsum.photos/seed/2/600/800',
  };

  beforeEach(() => {
    localStorage.clear();

    service = TestBed.inject(FavoritesService);
  });

  it('should create service', () => {
    expect(service).toBeTruthy();
  });

  it('should not have any favorites by default', () => {
    expect(service.favorites().length).toEqual(0);
  });

  it('should add photo to favorites', () => {
    service.add(photo1);

    expect(service.favorites()[0]).toEqual(photo1);
  });

  it('should prevent adding the same photo to favorites', () => {
    service.add(photo1);
    service.add(photo1);

    expect(service.favorites().length).toEqual(1);
  });

  it('should add photo with different id to favorites', () => {
    service.add(photo1);
    service.add(photo2);

    expect(service.favorites().length).toEqual(2);
    expect(service.favorites()[1]).toEqual(photo2);
  });

  it('should remove photo from favorites', () => {
    service.add(photo1);

    expect(service.favorites().length).toEqual(1);

    service.remove(photo1);

    expect(service.favorites().length).toEqual(0);
  });

  it('should check if photo is in favorites', () => {
    service.add(photo1);

    expect(service.isFavorite(photo1.id)).toBeTruthy();
    expect(service.isFavorite(photo2.id)).toBeFalsy();
  });

  it('should get favorites from local storage', () => {
    localStorage.setItem('image-library:favorites', JSON.stringify([photo1, photo2]));

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});

    const service = TestBed.inject(FavoritesService);

    expect(service.favorites().length).toEqual(2);
  });

  it('should return photo', () => {
    service.add(photo1);
    service.add(photo2);

    const photo = service.getById(photo1.id);

    expect(photo).toEqual(photo1);
  });
});
