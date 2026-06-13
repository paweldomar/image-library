import { Component, input, output } from '@angular/core';
import { Photo } from '../../da/models/photo.model';
import { MatCard } from '@angular/material/card';

@Component({
  selector: 'app-photo-card',
  imports: [MatCard],
  templateUrl: './photo-card.html',
  styleUrl: './photo-card.scss',
})
export class PhotoCard {
  readonly photo = input.required<Photo>();
  readonly photoClicked = output<Photo>();

  onPhotoClicked(): void {
    this.photoClicked.emit(this.photo());
  }
}
