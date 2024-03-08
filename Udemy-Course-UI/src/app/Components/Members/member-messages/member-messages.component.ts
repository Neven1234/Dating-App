import { Component, Input, OnInit } from '@angular/core';
import { Message } from '../../../Models/Message';
import { UserService } from '../../../_service/user.service';
import { AuthService } from '../../../_service/Auth.service';
import { AlertifyService } from '../../../_service/alertify.service';
import { tap } from 'rxjs/operators';


@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrl: './member-messages.component.css'
})
export class MemberMessagesComponent implements OnInit {
  @Input() recipientId:number
  messages:Message[]
  newMessage:Message={
    id:0,
    senderId:0,
    senderKnownAs:'',
    senderPhotoUrl:'string',
    recipientId:0,
    recipientKnownAs:'',
    recipientPhotoUrl:'',
    content:'',
    isRead:false,
    dateRead:new Date,
    messageSent:new Date,

  };
   currentUserId=+this.auth.decodedToken.userId
  constructor(private userService:UserService,private auth:AuthService,private alertify:AlertifyService){}
  ngOnInit(): void {
    this.loadMessages()
  }
  loadMessages(){
    this.userService.getMessageThread(this.auth.decodedToken.userId,this.recipientId)
    .pipe(
      tap (messages=>{
        for(let i=0;i<messages.length;i++){
          if(messages[i].isRead===false && messages[i].recipientId===this.currentUserId)
          this.userService.markAsSeen(this.currentUserId,messages[i].id)
        }
      })
    )
    .subscribe({
      next:(messages)=>{
        this.messages=messages
      },
      error:(error)=>{
        this.alertify.error(error)
      }
    })
  }
  sendMessage(){
    if(this.newMessage.content==null)
    {
      console.log('cos')
    }
    else{
      this.newMessage.recipientId=this.recipientId
      this.userService.sendMessage(this.auth.decodedToken.userId,this.newMessage).subscribe({
        next:(resp)=>{
          this.messages.push(resp)
          this.newMessage.content=''
        },error:(error)=>{
          this.alertify.error(error)
        }
      })
    }
   
  }

}
