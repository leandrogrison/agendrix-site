import { Routes } from '@angular/router';
import { App } from './app';
import { CompanyResolver } from './resolvers/company';
import { ServicesResolver } from './resolvers/services';
import { Home } from './pages/home/home';
import { Error } from './pages/error/error';

export const routes: Routes = [
  {
    path: '',
    component: App,
    resolve: { company: CompanyResolver },
    children: [
      {
        path: '',
        component: Home,
        resolve: { services: ServicesResolver },
      }
    ]
  },
  {
    path: '**',
    component: Error
  }
];
