import { AuthGuard } from './utils/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { LayoutComponent } from './components/layout/layout.component';
import { PageNotFoundComponent } from './components/formulaires/page-not-found.component';
import { Routes } from '@angular/router';
import { inject } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    title: "Home Page",
    component: HomeComponent
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'sign-in',
        title: 'Formulaire de connexion',
        loadComponent: () =>
          import('./components/formulaires/sign-in/sign-in.component').then(
            (c) => c.SignInComponent
          ),
      },
      {
        path: 'sign-up',
        title: "Formulaire d'inscription",
        loadComponent: () =>
          import('./components/formulaires/sign-up/sign-up.component').then(
            (c) => c.SignUpComponent
          ),
      },
      {
        path: 'donations',
        title: 'Mes dons',
        canActivate: [() => inject(AuthGuard).canActivate()],
        loadComponent: () =>
          import('./components/formulaires/donations/donations.component').then(
            (c) => c.DonationsComponent
          ),
      },
      {
        path: 'profil',
        title: 'Mon Profil',
        canActivate: [() => inject(AuthGuard).canActivate()],
        loadComponent: () => import('./components/my-profile/my-profile.component').then((c) => c.MyProfileComponent)

      }
    ]
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];
