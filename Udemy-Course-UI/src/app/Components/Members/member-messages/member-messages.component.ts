import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { Message } from '../../../Models/Message';
import { UserService } from '../../../_service/user.service';
import { AuthService } from '../../../_service/Auth.service';
import { AlertifyService } from '../../../_service/alertify.service';
import { tap } from 'rxjs/operators';
import { SignalRService } from '../../../_service/signal-r.service';
import { Pagination } from '../../../Models/Pagination';


@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrl: './member-messages.component.css'
})
export class MemberMessagesComponent implements OnInit {
  @Input() recipientId:number
  @ViewChild('messageContainer') messCont:ElementRef
  scrolledUp=false

  photo:string='http://res.cloudinary.com/ddonqb5ur/image/upload/v1709760114/aea4scnbaiujsfmv2jz7.png'

  messages:Message[]
  Loading:boolean=false
  noMainPhoto:boolean=false
  pageNumber=1
  pageSize=20;
  pagination:Pagination={
    currentPage: 1,
    itemPerPage: 0,
    totalItems: 0,
    totalPages: 0
  }
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
  recivedMessage:Message
   currentUserId=+this.auth.decodedToken.userId
  constructor(private userService:UserService,private auth:AuthService
    ,private alertify:AlertifyService,private signalRService:SignalRService){}

  async ngOnInit(): Promise<void> {
   await this.signalRService.startConnection()
    await this.signalRService.JoinGroup(this.recipientId.toString(),this.currentUserId.toString())
    this.signalRService.hubConnection.on("ReceiveMessage", async (message: Message) => {
      message.isRead = true;
      this.messages.push(message);
    })
    this.loadMessages()
   
    
  }

 
  loadMessages(){
    this.userService.getMessageThread(this.auth.decodedToken.userId,this.recipientId,this.pagination.currentPage,this.pageSize)
    .pipe(
      tap (messages=>{
        for(let i=0;i< messages.result.length;i++){
          if(messages.result[i].senderId!=this.currentUserId && !this.noMainPhoto &&messages.result[i].senderPhotoUrl==null )
          {
            this.noMainPhoto=true
          }
          if( messages.result[i].isRead===false &&  messages.result[i].recipientId===this.currentUserId)
          this.userService.markAsSeen(this.currentUserId, messages.result[i].id)
        }
       
      })
    )
    .subscribe({
      next:(messages)=>{
        this.messages=messages.result
      },
      error:(error)=>{
        this.alertify.error(error)
      }
    })
  }

  //scroll
  ngAfterViewChecked() { 
    if(!this.scrolledUp)
    {
      this.scrollToBottom();   
    }       
     
} 
  scrollToBottom(): void {
    try {
        this.messCont.nativeElement.scrollTop = this.messCont.nativeElement.scrollHeight;
    } catch(err) { }                 
}
onScrollDown(){
  console.log('scrolled')
}

onScrollUp(){
  this.scrolledUp=true
  this.pagination.currentPage+=1
  console.log('scrolled up, current page ',this.pagination.currentPage)
  this.Loading=true
  setTimeout(()=>{
    this.loadMore(this.pagination.currentPage)
  },1500)
  
}
  sendMessage(){
    this.scrollToBottom(); 
    this.scrolledUp=false
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
          this.scrolledUp=true
          
        },error:(error)=>{
          this.alertify.error(error)
        }
      })
    }
   
  }

  loadMore(nextPage:number){
    this.userService.getMessageThread(this.auth.decodedToken.userId,this.recipientId,nextPage,this.pageSize)
    .pipe(
      tap (messages=>{
       
        for(let i=0;i< messages.result.length;i++){
          if( messages.result[i].isRead===false &&  messages.result[i].recipientId===this.currentUserId)
          this.userService.markAsSeen(this.currentUserId, messages.result[i].id)
        }
      })
    )
    .subscribe({
      next:(messages)=>{
        console.log(messages)
        this.Loading=false
        this.messages= [...messages.result, ... this.messages]
      },
      error:(error)=>{
        this.alertify.error(error)
      }
    })
  }
}
