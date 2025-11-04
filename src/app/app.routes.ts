import { Routes } from '@angular/router';
import { Convite } from './pages/convite/convite';
import { Confirmacao } from './pages/confirmacao/confirmacao';
import { Home } from './pages/home/home';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'convite/:id', component: Convite },
    { path: 'confirmacao/:id', component: Confirmacao },
];
