import { Routes } from '@angular/router';
import { App } from './app';
import { CompanyResolver } from './resolvers/company';
import { ServicesResolver } from './resolvers/services';
import { ServiceResolver } from './resolvers/service';
import { Error } from './pages/error/error';

export const routes: Routes = [
  {
    path: '',
    component: App,
    resolve: { company: CompanyResolver },
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home/home').then(m => m.Home),
        resolve: { services: ServicesResolver },
      },
      {
        path: 'servico/:id',
        loadComponent: () => import('./pages/service/service').then(m => m.Service),
        resolve: { company: CompanyResolver, service: ServiceResolver },
      },
      {
        path: 'agendamento-confirmado',
        loadComponent: () => import('./pages/appointment-created/appointment-created').then(m => m.AppointmentCreated),
        resolve: { company: CompanyResolver, services: ServicesResolver },
      }
    ]
  },
  {
    path: '**',
    component: Error
  }
];
