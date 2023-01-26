import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-conversations-list',
  templateUrl: './conversations-list.component.html',
  styleUrls: ['./conversations-list.component.css']
})
export class ConversationsListComponent implements OnInit {

  constructor(private route:Router) { }

  ngOnInit(): void {
  }

  onMessage(){
      this.route.navigateByUrl('/menu/ab')
  }

}
