import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header';
import { Loader } from './shared/loader/loader';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Loader],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
