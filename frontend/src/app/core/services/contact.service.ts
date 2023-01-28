import { Injectable } from '@angular/core';
import { Contact} from '../../models/contact.model';
import { Subject } from 'rxjs';
 



const baseUrl = "http://localhost:3000"


@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contactSubject = new Subject<Contact[]>();
  private contacts: Contact[] = [];
  emitContacts() {
    this.contactSubject.next(this.contacts.slice());
  }

   getCookie(cname :string) : string {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  async getAllContacts(){

    
    const myHeaders = new Headers({
      "Content-Type": "application/json",   
      "Authorization" : "Bearer " + this.getCookie("jwt") 
    })

    console.log(myHeaders.get('Authorization'))

    return await fetch(baseUrl + "/api/v0/contacts", {
        method : "get",
        mode : "cors", 
        headers : myHeaders, 
    })
    .then(res => res.json())
    .then(   
      (contacts )=>{

        contacts.map((cont: Contact) => this.contacts.push(new Contact(cont.number, cont.name, cont.photo)))

      this.emitContacts();
  
    }).catch((err) => {
  
      this.emitContacts();
  
    });



  }

  async addContact(contact: Contact) {
    
    const cont = {
      name: contact.name,
      phoneNumber : contact.number
    };
 

    const myHeaders = new Headers({
      "Content-Type": "application/json",   
      "Authorization" : "Bearer " + this.getCookie("jwt") 
    })

    console.log(myHeaders.get('Authorization'))

  return await fetch(baseUrl + "/api/v0/contacts", {
      method : "post",
      mode : "cors", 
      headers : myHeaders,
      body: JSON.stringify(cont)
  })
  .then(res => res.json())
  .then(   
    (cont)=>{
 
    this.contacts.push(new Contact(cont.number, cont.name, cont.photo));
    this.emitContacts();

  }).catch((err) => {

    this.emitContacts();

  });
    
  }
  deleteContact(contact: Contact){
    ////
    this.emitContacts();
  }
  modifyContact(contact: Contact, name:string, number:string, photo:string){
    //////////
    this.emitContacts();
  }
  constructor() { }
}
