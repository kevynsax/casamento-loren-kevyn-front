import { Routes } from '@angular/router';
import { Convite } from './pages/convite/convite';
import { Confirmacao } from './pages/confirmacao/confirmacao';

export const routes: Routes = [
      { path: 'convite/:id', component: Convite},
      { path: 'confirmacao/:id', component: Confirmacao},
];
