import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-conversations-list',
  templateUrl: './conversations-list.component.html',
  styleUrls: ['./conversations-list.component.scss']
})
export class ConversationsListComponent implements OnInit {

  constructor(private router: Router) { }
  conversations:any[]=[
    {nom: 'Joel', message:'Hey my friend !'},
    {nom: 'Franck', message:"I hape you're ok"},
    {nom: 'Takala', message:'Waiting since 5'},
    ];
  ngOnInit(): void {
  }
  onViewConv(id:number){
    this.router.navigate(['core', 'conversations',id]);
  }

}
