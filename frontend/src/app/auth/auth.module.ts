import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { BackuppasswordComponent } from './backuppassword/backuppassword.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';


import { PasswordDirective } from './directives/password.directive';




@NgModule({
  declarations: [
    AuthComponent,
    SigninComponent,
    SignupComponent,
    BackuppasswordComponent,
    ForgotPasswordComponent,
    PasswordDirective,
    
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: []
})
export class AuthModule { }
