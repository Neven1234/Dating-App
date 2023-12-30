import { Component, OnInit } from '@angular/core';
import { user } from '../../Models/User';
import { UserService } from '../../_service/user.service';

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
  constructor(private serivices:UserService){}
  ngOnInit(): void {
    
  }
  LogIn()
  {
    this.serivices.LogIn(this.user).subscribe(next=>{
      console.log('logged in successfuly')
    },error=>{
      console.log('failed to login')
    })
  }
  LoggedIn(){
    var token=localStorage.getItem('token')
    return !! token
  }
  LogOut(){
    localStorage.removeItem('token')
    console.log('loged out')
  }
}
