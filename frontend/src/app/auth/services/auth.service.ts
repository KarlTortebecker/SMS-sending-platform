import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
 
const myHeaders = new Headers({
    "Content-Type": "application/json", 
    "Set-Cookie" : "true",
  })

const baseUrl = "http://localhost:3000"

@Injectable()
export class AuthService {
    constructor(private router: Router){}
    isAdmin:boolean = false;
    isAuth:boolean = false; //boolean for authentication state
    /*This is the service where authentication functons are defined */
    async signUpUser(phoneNumber: string, username:string, password: string){
        const user = {
            username: username,
            phoneNumber : phoneNumber,
            password: password
          };

          console.log(user)

         

        return await fetch(baseUrl + "/api/v0/users", {
            method : "post",
            mode : "cors",
            headers : myHeaders,
            body: JSON.stringify(user)
        });
        
    }
    signInUser(username:string, password:string){
        let user = {
            username: username,
            password: password
          };
        return fetch(baseUrl + "/api/v0/auth/login", {
            method : "POST",
            mode : "cors",
            headers : myHeaders,
            body: JSON.stringify(user)
        });
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