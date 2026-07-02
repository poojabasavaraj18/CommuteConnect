import { Routes } from '@angular/router';

import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { Dashboard } from './features/dashboard/dashboard/dashboard';
import { Feed } from './features/rides/feed/feed';
import { MyRides } from './features/rides/my-rides/my-rides';
import { Interests } from './features/interests/interests/interests';
import { Profile } from './features/profile/profile/profile';

import { HomeLayout } from './core/layout/home-layout/home-layout';

import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [

  {
    path:'',
    redirectTo:'login',
    pathMatch:'full'
  },

  {
    path:'login',
    component:Login
  },

  {
    path:'register',
    component:Register
  },

  {
    path:'',
    component:HomeLayout,
    canActivate:[authGuard],
    children:[

      {
        path:'dashboard',
        component:Dashboard
      },

      {
        path:'feed',
        component:Feed
      },

      {
        path:'my-rides',
        component:MyRides
      },

      {
        path:'interests',
        component:Interests
      },

      {
        path:'profile',
        component:Profile
      }

    ]

  },

  {
    path:'**',
    redirectTo:'login'
  }

];