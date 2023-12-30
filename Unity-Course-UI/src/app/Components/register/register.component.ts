import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { user } from '../../Models/User';
import { UserService } from '../../_service/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit  {
  constructor(private service:UserService){}
 @Output() cancelRegister=new EventEmitter()
  user:user={
    username:'',
    password:''
  }
  ngOnInit(): void {
  
  }
  regiser(){
    this.service.Register(this.user).subscribe((res)=>{
      console.log('registration successful')
    },error=>{
      console.log(error)
    })
  }
  Cancel(){
    this.cancelRegister.emit(false)
    console.log('cancel')
  }
}
