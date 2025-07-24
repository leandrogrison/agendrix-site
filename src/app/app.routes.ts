import { Routes } from '@angular/router';
import { App } from './app';
import { CompanyResolver } from './resolvers/company';
import { Home } from './pages/home/home';

export const routes: Routes = [
  {
    path: '',
    component: App,
    resolve: { company: CompanyResolver },
    children: [
      {
        path: '',
        component: Home
      }
    ]
  }
];
