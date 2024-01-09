import { Component, OnInit } from '@angular/core';
import { user } from '../../Models/User';
import { UserService } from '../../_service/user.service';
import { AlertifyService } from '../../_service/alertify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit {
  user:user={
    username:'',
    password:''
  }
  constructor(public serivices:UserService,private Alertify:AlertifyService,private router:Router){}
  ngOnInit(): void {
    
  }
  LogIn()
  {
    this.serivices.LogIn(this.user).subscribe(next=>{
      this.Alertify.success('logged in successfuly')
      this.router.navigate(['/members'])

    },error=>{
     this.Alertify.error('failed to login')
    })
  }
  LoggedIn(){
    return this.serivices.LoggedIn();
  }
  LogOut(){
    localStorage.removeItem('token')
   this.Alertify.message('loged out')
   this.router.navigate(['/home'])
  }
}
