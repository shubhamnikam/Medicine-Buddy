import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AuthService } from './core/services/auth.service';
import { AuthComponent } from './shared/auth/auth.component';
import { HomeComponent } from './features/home/home.component';
import { ProfileComponent } from './features/profile/profile.component';
import { HistoryComponent } from './features/history/history.component';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { MainComponent } from './features/main/main.component';
import { RegisterComponent } from './features/register/register.component';

const routes: Routes = [
  //auth
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: 'auth', component: AuthComponent, pathMatch: 'full'},
  { path: 'register', component: RegisterComponent, pathMatch: 'full'},
  //features
  {
    path: 'page',
    children: [
      {
        path: 'home',
        component: HomeComponent,
        canActivate: [AuthGuard],
        pathMatch: 'full'
      },
      {
        path: 'main',
        component: MainComponent,
        canActivate: [AuthGuard],
        pathMatch: 'full'
      },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGuard],
        pathMatch: 'full'
      },
      {
        path: 'history',
        component: HistoryComponent,
        canActivate: [AuthGuard],
        pathMatch: 'full'
      },
    ],
    canActivate: [AuthGuard]
  },
  //404
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
