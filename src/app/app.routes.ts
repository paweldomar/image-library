import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Image Library',
    loadComponent: () => import('./features/photos/photos-page/photos-page').then(m => m.PhotosPage),
  },
  {
    path: 'favorites',
    title: 'Favorites',
    loadComponent: () => import('./features/favorites/favorites-page/favorites-page').then(m => m.FavoritesPage),
  },
  {
    path: 'photos/:id',
    title: 'Photo details',
    loadComponent: () => import('./features/photo-details/photo-details-page/photo-details-page').then(m => m.PhotoDetailsPage),
  },
  {
    path: '**',
    redirectTo: '',
  }
];
