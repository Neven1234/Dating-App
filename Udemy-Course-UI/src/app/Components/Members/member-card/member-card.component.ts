import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../../Models/UserDTO';
import { AuthService } from '../../../_service/Auth.service';
import { UserService } from '../../../_service/user.service';
import { AlertifyService } from '../../../_service/alertify.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.css'
})
export class MemberCardComponent implements OnInit {
 @Input()likesParam:string=''
 @Input() user:User={
   id: 0,
   username: '',
   knownAs: '',
   age: 0,
   gender: '',
   created: new Date(),
   lastActive: new Date(),
   photoUrl: '',
   city: '',
   country: '',
   lookingFor: '',
   iLiked:false
 }
 like:boolean=false
 disLike:boolean=false
 constructor(private authservice:AuthService,private userService:UserService,private alertify:AlertifyService){}
  ngOnInit(): void {
    
  }
  SendLike(id:number){
    this.userService.sendLike(this.authservice.decodedToken.userId,id).subscribe({
      next:(response)=>{
        this.alertify.success('you have liked '+ this.user.knownAs)
        this.like=true
        this.user.iLiked==true
        // setTimeout(() => {
        //   window.location.reload()
        // }, 10);
      },
      error:(error)=>{
        this.alertify.error(error)
      }
    })
  }
  RemoveLike(id:number){
    this.userService.removeLike(this.authservice.decodedToken.userId,id).subscribe({
      next:()=>{
        this.alertify.success('you removed '+this.user.knownAs+' from your likes')
        this.disLike=true
        setTimeout(() => {
         
          window.location.reload()
        }, 2000);
      },
      error:(error)=>{
        this.alertify.error(error)
      }
    })
  }

}
