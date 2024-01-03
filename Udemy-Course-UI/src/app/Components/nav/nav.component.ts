import { Component, OnInit } from '@angular/core';
import { user } from '../../Models/User';
import { UserService } from '../../_service/user.service';
import { AlertifyService } from '../../_service/alertify.service';

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
  constructor(public serivices:UserService,private Alertify:AlertifyService){}
  ngOnInit(): void {
    
  }
  LogIn()
  {
    this.serivices.LogIn(this.user).subscribe(next=>{
      this.Alertify.success('logged in successfuly')
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
  }
}
