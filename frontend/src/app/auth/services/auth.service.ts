import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {
    constructor(private router: Router){}
    isAdmin:boolean = false;
    isAuth:boolean = false; //boolean for authentication state
    /*This is the service where authentication functons are defined */
    signUpUser(email: string, username:string, password: string){
        return new Promise( //asynchronous function
            (resolve, reject) => {
                //Place backend function here
            }
        );
        
    }
    signInUser(username:string, password:string){
        return new Promise( //asynchronous function
            (resolve, reject) => {
                setTimeout(
                () => {
                    this.isAuth = true;
                    resolve(true);
                }, 2000
                );
            }
        );
    }
    backupPassword(email:string){
        return new Promise( //asynchronous function
            (resolve, reject) => {
                //Place backend function here
            }
        );
    }
    signOut() {
        
        this.isAuth = false;
        
    }
}