import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../../_service/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertifyService } from '../../../_service/alertify.service';
import { AuthService } from '../../../_service/Auth.service';
import { User } from '../../../Models/UserDTO';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrl: './member-edit.component.css'
})
export class MemberEditComponent implements OnInit {

  @ViewChild('editForm', { static: true })
  
  editForm!: NgForm;
  user:User={
    id: 0,
    username: '',
    knownAs: '',
    age: 0,
    gender: '',
    created: new Date,
    lastActive: new Date,
    photoUrl: '',
    city: '',
    country: '',
    lookingFor: ''
  }
  photoUrl:string=''
  @HostListener('window:beforeunload',['$event'])
  unloadeNotification($event:any){
    if(this.editForm.dirty){
      $event.returnValue=true
    }
  }
  constructor(private userService:UserService,private alertify:AlertifyService,
    private route:ActivatedRoute,private auth:AuthService,private router:Router){}
  ngOnInit(): void {
    console.log('user id ',this.auth.decodedToken.userId)
    this.LoadeUser()
    this.auth.currentPhotoUrl.subscribe(photoUrl=>this.photoUrl=photoUrl)
  }


  LoadeUser(){
    return this.userService.GetUser(this.auth.decodedToken.userId).subscribe({
      next:(result)=>{
        this.user=result
       
        console.log(this.user.photoUrl)
      },
      error:(error)=>{
        console.log(error)
        this.router.navigate(['members'])
        this.alertify.error('problem retrieving your data')
      }
    })
  }
  updateUser(){
    this.userService.UpdateUser(this.auth.decodedToken.userId,this.user).subscribe({
      next:(rsult)=>{
        this.alertify.success("profile updated successfully")
        this.editForm.reset(this.user)
      },
      error:(error)=>{
        this.alertify.error(error)
      }
    })
    
  }

  updateMainPhoto(photoUrl:any){
    this.user.photoUrl=photoUrl
  }
}
