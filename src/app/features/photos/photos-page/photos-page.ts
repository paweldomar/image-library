import {Component, inject, DestroyRef, OnInit, signal} from '@angular/core';
import { PhotoGrid } from '../../../shared/photo-grid/photo-grid';
import {PhotoApiService} from '../../../da/services/photo-api.service';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {Photo} from '../../../da/models/photo.model';
import {FavoritesService} from '../../../da/services/favorites.service';
import {finalize, take} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Loader} from '../../../shared/loader/loader';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-photos-page',
  imports: [MatButtonModule, MatSnackBarModule, Loader, PhotoGrid],
  templateUrl: './photos-page.html',
  styleUrl: './photos-page.scss',
})
export class PhotosPage implements OnInit {
  private readonly _photoApiService = inject(PhotoApiService);
  private readonly _favoritesService = inject(FavoritesService);
  private readonly _snackBar = inject(MatSnackBar);
  private readonly _destroyRef = inject(DestroyRef);

  readonly photos = signal<Photo[]>([]);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);
  readonly pageSize = 20;

  ngOnInit(): void {
    this.loadMore();
  }

  loadMore(): void {
    if (this.isLoading()) {
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    this._photoApiService
      .getPhotos(this.pageSize)
      .pipe(
        take(1),
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe({
        next: photos => {
          this.photos.update(currentPhotos => [...currentPhotos, ...photos]);
        },
        error: () => {
          this.error.set('Could not load photos. Please try again.');
        },
      });
  }

  addToFavorites(photo: Photo): void {
    const added = this._favoritesService.add(photo);

    this._snackBar.open(
      added ? 'Photo added to favorites' : 'Photo is already in favorites',
      'Close',
      {
        duration: 2000,
      },
    );
  }
}
