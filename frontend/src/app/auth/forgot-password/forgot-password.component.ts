import { Component, OnInit } from '@angular/core';
import {  FormBuilder, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm : FormGroup = this.fb.group({ });
  
  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private router:Router) { 

    }
    get f(): {[key: string]: AbstractControl}{
      return this.forgotPasswordForm.controls;
    }
    
    initForm(){
      this.forgotPasswordForm = this.fb.group({
        email: ['', [Validators.required,Validators.email]]
      });
    }
    onSubmit(): void {
      var email = this.forgotPasswordForm.get('email')!.value;
      this.authService.backupPassword(email).then(
        () => {this.router.navigate(['/auth/backuppassword']);},
        (error) => {}
      );
      
    }
    ngOnInit(): void {
      this.initForm();
    }

}
