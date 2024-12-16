import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule),
  },
  {
    path: 'signup',
    loadChildren: () => import('./signup/signup.module').then(m => m.SignupPageModule),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardPageModule),
  },
  {
    path: 'memories',
    loadChildren: () => import('./memories/memories.module').then(m => m.MemoriesPageModule),
  },
  {
    path: 'journey',
    loadChildren: () => import('./journey/journey.module').then(m => m.JourneyPageModule),
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then(m => m.ProfilePageModule),
  },
  {
    path: 'about',
    loadChildren: () => import('./about/about.module').then(m => m.AboutPageModule),
  },
  {
    path: 'create-memory',
    loadChildren: () => import('./create-memory/create-memory.module').then(m => m.CreateMemoryPageModule),
  },  {
    path: 'blog',
    loadChildren: () => import('./blog/blog.module').then( m => m.BlogPageModule)
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
