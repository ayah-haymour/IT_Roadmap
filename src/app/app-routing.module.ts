import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactComponent } from './contact/contact.component';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path:'contact',
    component:ContactComponent
  },
  {
    path:'about',
    component:AboutComponent
  },
  {
    path:'',
    component:HomeComponent
  },

  {
    path:'security',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path:'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
    //,canActivate:[authorizationGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
