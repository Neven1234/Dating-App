import { Component, OnInit } from '@angular/core';
import { Auth } from '../../Models/User';
import { AuthService } from '../../_service/Auth.service';
import { AlertifyService } from '../../_service/alertify.service';
import { Router } from '@angular/router';

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
  constructor(public auth:AuthService,private Alertify:AlertifyService,private router:Router){}
  ngOnInit(): void {
    this.auth.currentPhotoUrl.subscribe(photoUrl=>this.photoUrl=photoUrl)
  }
  LogIn()
  {
    this.auth.LogIn(this.user).subscribe(next=>{
      this.Alertify.success('logged in successfuly')
      setTimeout(() => {
        this.router.navigate(['/members'])
      }, 1000);      

    },error=>{
     this.Alertify.error('failed to login')
    })
  }
  LoggedIn(){
    return this.auth.LoggedIn();
  }
  LogOut(){
    localStorage.removeItem('token')
   this.Alertify.message('loged out')
   this.router.navigate(['/home'])
  }
}
