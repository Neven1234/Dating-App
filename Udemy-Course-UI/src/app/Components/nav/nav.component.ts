import { Component, OnInit } from '@angular/core';
import { Auth } from '../../Models/User';
import { AuthService } from '../../_service/Auth.service';
import { AlertifyService } from '../../_service/alertify.service';
import { Router } from '@angular/router';
import { SignalRService } from '../../_service/signal-r.service';
import { SocialAuthService } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit {
  user:Auth={
    username:'',
    password:''
  }
  photoUrl:string=''
  laoding:boolean=false
  laoding2:boolean=false
  constructor(public auth:AuthService,private Alertify:AlertifyService
    ,private router:Router, private signalRSerivce:SignalRService,private socialAuthServices:SocialAuthService){}
  ngOnInit(): void {
     
    this.auth.currentPhotoUrl.subscribe(photoUrl=>this.photoUrl=photoUrl)
  }
  LogIn()
  {
    this.auth.LogIn(this.user).subscribe(next=>{
      this.Alertify.success('logged in successfuly')
      this.laoding=true
      setTimeout(() => {
        this.laoding=false
        this.router.navigate(['/members'])
      }, 1500);      

    },error=>{
     this.Alertify.error('failed to login')
    })
  }
  LoggedIn(){
    return this.auth.LoggedIn();
  }
   LogOut(){
    // localStorage.removeItem('token')
    this.laoding2=true
    localStorage.clear()
    setTimeout(() => {
      this.laoding2=false
      this.router.navigate(['/home'])
      this.Alertify.message('loged out')
    }, 1500);      
    
   
   
  
  }
}
