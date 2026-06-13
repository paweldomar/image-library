import { TestBed } from '@angular/core/testing';
import { PhotoApiService } from './photo-api.service';
import { firstValueFrom } from 'rxjs';

describe('PhotoApiService', () => {
  let service: PhotoApiService;

  beforeEach(() => {
    service = TestBed.inject(PhotoApiService);
  });

  it('should create service', () => {
    expect(service).toBeTruthy();
  });

  it('should return given number of photos', async () => {
    const photosLength = 10;
    const photosArray = await firstValueFrom(service.getPhotos(photosLength));

    expect(photosArray.length).toEqual(photosLength);
  });

  it('should return photos with correct values', async () => {
    const photosArray = await firstValueFrom(service.getPhotos(3));

    expect(photosArray[0].fullSizeUrl).toEqual(
      `https://picsum.photos/seed/${photosArray[0].id}/600/800`,
    );
    expect(photosArray[0].thumbnailUrl).toEqual(
      `https://picsum.photos/seed/${photosArray[0].id}/200/300`,
    );
    expect(photosArray[0].id).not.toEqual(photosArray[1].id);
    expect(photosArray[0].id).not.toEqual(photosArray[2].id);
    expect(photosArray[1].id).not.toEqual(photosArray[2].id);
  });
});
