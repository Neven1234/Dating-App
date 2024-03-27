import { Component, OnInit } from '@angular/core';
import { UserService } from '../../_service/user.service';
import { AuthService } from '../../_service/Auth.service';
import { AlertifyService } from '../../_service/alertify.service';
import { Router } from '@angular/router';
import { Message } from '../../Models/Message';
import { Pagination } from '../../Models/Pagination';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent implements OnInit {
  
  constructor(private userService:UserService,private auth:AuthService
    ,private alertify:AlertifyService,private router:Router){}
  f:string=''
  pageNumber=1
  pageSize:15
  OutboxCheck=false;
  messages:Message[]
  pagination:Pagination={
    currentPage: 1,
    itemPerPage: 0,
    totalItems: 0,
    totalPages: 0
  }
  messageContainer='Unread'
    ngOnInit(): void {
    
      this.loadMessages()

  }
  loadMessages(){
    
    this.userService.getMessages(this.auth.decodedToken.userId ,this.pagination.currentPage,15,this.messageContainer).subscribe({
      next:(result)=>{
        this.messages=result.result
        this.pagination=result.pagination
      },
      error:(error)=>{
        this.alertify.error(error)
      }
    })
  }
  pageChanged(event: PageChangedEvent): void {
    this.pagination.currentPage= event.page;
    console.log(event.page)
    this.loadMessages()
   }
   outbox(){
    this.OutboxCheck=true
   }
   deleteMessage(id:number){
    this.alertify.Confirm('are you sure you want to delete this message',()=>{
      this.userService.deleteMessage(id,this.auth.decodedToken.userId).subscribe(()=>{
        this.messages.splice(this.messages.findIndex(m=>m.id==id),1)
        this.alertify.success('message has been deleted')
      },error=>{
        this.alertify.error('Failed to delete the message')
      })
    })
  }
}
