import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { PreloadAllModules } from '@angular/router';
import { AuthGuardService } from './auth/services/auth-guard.service';
import { IndexComponent } from './index/index.component';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  
  { path: '', component: IndexComponent },
  /* Feature modules */
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  { path: 'core', /*canActivate: [AuthGuardService],*/ loadChildren: () => import('./core/core.module').then(m => m.CoreModule) },
  { path: 'not-found', component: NotFoundComponent },
  { 
    path: '**', 
    redirectTo: 'not-found',
    pathMatch: 'full' 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
