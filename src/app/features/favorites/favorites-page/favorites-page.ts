import { Component, inject } from '@angular/core';
import { FavoritesService } from '../../../da/services/favorites.service';
import { Router, RouterLink } from '@angular/router';
import { PhotoGrid } from '../../../shared/photo-grid/photo-grid';
import { Photo } from '../../../da/models/photo.model';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-favorites-page',
  imports: [PhotoGrid, MatButtonModule, RouterLink],
  templateUrl: './favorites-page.html',
  styleUrl: './favorites-page.scss',
})
export class FavoritesPage {
  private readonly _favoritesService = inject(FavoritesService);
  private readonly _router = inject(Router);

  readonly favorites = this._favoritesService.favorites;
  readonly favoritesCount = this._favoritesService.favoritesCount;
  readonly isEmpty = this._favoritesService.isEmpty;

  openPhoto(photo: Photo): void {
    this._router.navigate(['/photos', photo.id]);
  }
}
