import { Routes } from '@angular/router';

import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { Dashboard } from './features/dashboard/dashboard/dashboard';
// import { Feed } from './features/post/post-feed/post-feed';
import { Interests } from './features/interests/interests/interests';
import { Profile } from './features/profile/profile/profile';

import { HomeLayout } from './core/layout/home-layout/home-layout';

import { authGuard } from './core/guards/auth-guard';
import { PostFeed } from './features/posts/post-feed/post-feed';
import { CreatePost } from './features/posts/create-post/create-post';
import { MyPosts } from './features/posts/my-posts/my-posts';

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
  path: 'posts',
  component: PostFeed
},
{
    path: 'my-posts',
    component: MyPosts
},
{
  path: 'create-post',
  component: CreatePost
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