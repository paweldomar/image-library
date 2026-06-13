import { Service } from '@angular/core';
import { Photo } from '../models/photo.model';
import { delay, Observable, of } from 'rxjs';

@Service()
export class PhotoApiService {
  private readonly _photosUrl = 'https://picsum.photos/';
  private readonly _thumbnailWidth = 200;
  private readonly _thumbnailHeight = 300;
  private readonly _fullSizeWidth = 600;
  private readonly _fullSizeHeight = 800;
  private readonly _minDelayMs = 200;
  private readonly _maxDelayMs = 300;

  getPhotos(count: number): Observable<Photo[]> {
    const photos = Array.from({ length: count }, () => this.createPhoto());

    return of(photos).pipe(delay(this.generateDelay()));
  }

  private createPhoto(): Photo {
    const id = this.createRandomPhotoSeed();
    const thumbnailUrl = this.createPhotoUrl(id, this._thumbnailWidth, this._thumbnailHeight);
    const fullSizeUrl = this.createPhotoUrl(id, this._fullSizeWidth, this._fullSizeHeight);

    return {
      id,
      thumbnailUrl,
      fullSizeUrl,
    };
  }

  private createRandomPhotoSeed(): string {
    return crypto.randomUUID();
  }

  private createPhotoUrl(seed: string, width: number, height: number): string {
    return `${this._photosUrl}seed/${seed}/${width}/${height}`;
  }

  private generateDelay(): number {
    return Math.floor(Math.random() * (this._maxDelayMs - this._minDelayMs + 1)) + this._minDelayMs;
  }
}
