import { Component, OnInit } from '@angular/core';
import { user } from './user';
import { Ngform} from '@angular/forms';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {



  public user: user = new user();
  constructor() { }

  ngOnInit(): void {
  }


  public saveData(registerForm: NgForm){
    console.log('registerForm.form');
    console.log('valeurs: ',JSON.stringify(registerForm.value));
    console.log('hello');
  }
}
