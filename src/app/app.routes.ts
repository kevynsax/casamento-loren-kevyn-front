import { Routes } from '@angular/router';
import { Convite } from './convite/convite';
import { Confirmacao } from './confirmacao/confirmacao';

export const routes: Routes = [
      { path: 'convite', component: Convite},
      { path: 'confirmacao', component: Confirmacao},
];
