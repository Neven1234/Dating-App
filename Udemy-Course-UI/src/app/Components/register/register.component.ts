import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Auth } from '../../Models/User';
import { AuthService } from '../../_service/Auth.service';
import { AlertifyService } from '../../_service/alertify.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit  {
  constructor(private service:AuthService,private Alertify:AlertifyService){}
 @Output() cancelRegister=new EventEmitter()
  user:Auth={
    username:'',
    password:''
  }
  ngOnInit(): void {
  
  }
  regiser(){
    this.service.Register(this.user).subscribe((res)=>{
     this.Alertify.success('registration successful')
    },error=>{
      this.Alertify.error(error)
    })
  }
  Cancel(){
    this.cancelRegister.emit(false)
    console.log('cancel')
  }
}
