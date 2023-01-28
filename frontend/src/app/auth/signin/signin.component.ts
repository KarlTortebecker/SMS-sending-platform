import { Component, OnInit } from '@angular/core';
import {  FormBuilder, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AuthGuardService} from '../services/auth-guard.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  signinForm : FormGroup = this.fb.group({ });
  submitted = false;
  signinMessage: string = '';
  authMessage: string = '';
  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router:Router,
              private authGuardService: AuthGuardService) { 

  }
  get phone(){
    return this.signinForm.get('phone');
  }
  get password(){
    return this.signinForm.get('password');
  }

  setCookie(cname :string, cvalue :string, exdays : number): void {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  onSubmit(): void {
    var phone = this.signinForm.get('phone')!.value;
    var password = this.signinForm.get('password')!.value;
    console.log(phone)
    console.log(password)
    this.authService.signInUser(phone,password)
    .then( res => res.json() )
    .then(
      
      (res) => {
        
        this.setCookie("jwt", res.token, 30)
        console.log(document.cookie);

        this.router.navigate(['/core']);
      },
      (error) => {
        this.signinMessage = "message d'erreur venant du backend ";
        this.router.navigate(['/auth/signup']);
      }
    );
    
  }
  initForm(){
    this.signinForm = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern("^6[0-9]{8}")]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.pattern("^.*[~!@#$%^&*|]+.*$")]]
    });
  }
  ngOnInit(): void {
    this.authMessage = this.authGuardService.authMessage;
    this.initForm();
  }

}
