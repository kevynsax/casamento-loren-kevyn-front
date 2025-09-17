import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Convite } from './convite/convite';
import { bootstrapApplication } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
}



