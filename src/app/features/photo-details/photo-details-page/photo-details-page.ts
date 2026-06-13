import {Component, computed, inject, signal} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FavoritesService } from '../../../da/services/favorites.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {Loader} from '../../../shared/loader/loader';

@Component({
  selector: 'app-photo-details-page',
  imports: [MatButtonModule, MatIconModule, Loader],
  templateUrl: './photo-details-page.html',
  styleUrl: './photo-details-page.scss',
})
export class PhotoDetailsPage {
  private readonly _route = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _favoritesService = inject(FavoritesService);

  readonly isLoading = signal(true);
  readonly photoId = computed(() => this._route.snapshot.paramMap.get('id'));
  readonly photo = computed(() => {
    const photoId = this.photoId();

    if (!photoId) {
      return undefined;
    }

    return this._favoritesService.getById(photoId);
  });

  onLoaded() {
    this.isLoading.set(false);
  }

  removeFromFavorites(): void {
    const photo = this.photo();

    if (!photo) {
      return;
    }

    this._favoritesService.remove(photo);
    this._router.navigate(['/favorites']);
  }
}
