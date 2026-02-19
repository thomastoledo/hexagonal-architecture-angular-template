import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'tickets/create',
        pathMatch: 'full',
    },
    {
        path: 'tickets/create',
        loadComponent: () => import('./ui/tickets/create-ticket/create-ticket').then(m => m.CreateTicket),
    }
];
