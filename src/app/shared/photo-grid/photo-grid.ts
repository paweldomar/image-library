import { Component, input, output } from '@angular/core';
import { Photo } from '../../da/models/photo.model';
import { PhotoCard } from '../photo-card/photo-card';

@Component({
  selector: 'app-photo-grid',
  imports: [PhotoCard],
  templateUrl: './photo-grid.html',
  styleUrl: './photo-grid.scss',
})
export class PhotoGrid {
  readonly photos = input.required<Photo[]>();
  readonly photoClicked = output<Photo>();

  onPhotoClicked(photo: Photo): void {
    this.photoClicked.emit(photo);
  }
}
