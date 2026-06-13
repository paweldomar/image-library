import { computed, effect, Service, signal } from '@angular/core';
import { Photo } from '../models/photo.model';

const FAVORITES_KEY = 'image-library:favorites';

@Service()
export class FavoritesService {
  private readonly _favorites = signal<Photo[]>(this.loadFavoritesFromStorage());

  readonly favorites = this._favorites.asReadonly();
  readonly favoritesCount = computed(() => this._favorites().length);

  constructor() {
    effect(() => this.saveFavoritesToStorage(this._favorites()));
  }

  add(photo: Photo): void {
    this._favorites.update((favorites) => {
      const alreadyInFavorites = this.isFavorite(photo.id);

      if (alreadyInFavorites) {
        return favorites;
      }

      return [...favorites, photo];
    });
  }

  remove(photo: Photo): void {
    this._favorites.update((favorites) => favorites.filter((favorite) => favorite.id !== photo.id));
  }

  isFavorite(photoId: string): boolean {
    return this._favorites().some((photo) => photo.id === photoId);
  }

  private loadFavoritesFromStorage(): Photo[] {
    const favorites = localStorage.getItem(FAVORITES_KEY);

    return favorites ? (JSON.parse(favorites) ?? []) : [];
  }

  private saveFavoritesToStorage(favorites: Photo[]): void {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }
}
