import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../_service/Auth.service';
import { newUserFromGoogle } from '../../Models/newRegisterFormGoogle';
import { googleDTO } from '../../Models/googleRegisterDTO';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  googleDTO:googleDTO={
    idToken:''
  }
  registerMode:boolean=false
  newUser:boolean=false
  laoding:boolean=false
  newUSER:newUserFromGoogle={
    username: '',
    knownAs: '',
    password: '',
    gender: '',
    dateOfBirth: new Date(),
    city: '',
    country: ''
  }
  constructor(private auth:AuthService,private socialAuthServices:SocialAuthService,private router:Router){}
  ngOnInit(): void {
    //Google
    this.socialAuthServices.authState.subscribe((result)=>{
      
      this.registerWithGoogle(result)
    })
    console.log(this.newUser)
  }
  
  registerHandel(){
    this.registerMode=true
  }

  cancelRegisterMode(registerMode:boolean){
    this.registerMode=registerMode
    console.log('canceled')
  }

  async registerWithGoogle(result:SocialUser){
      this.googleDTO.idToken=result.idToken
     await this.auth.LoginWithGoogle(this.googleDTO).subscribe({
        next:(response)=>{
          var newUser=this.auth.newUserWithGoogle
          if(newUser){
            
            this.newUSER.username= result.firstName
            this.newUSER.knownAs=result.name
            this.registerMode=true
            this.newUser=true
            console.log(this.newUSER.username,'and : ',this.newUSER.knownAs)
          }
          else{
            this.laoding=true
            this.router.navigate(['/members'])
            setTimeout(()=>{
              this.laoding=false
              window.location.reload()
            },10)
            
          }
        }
      })
  }
  LoggedIn(){
    return this.auth.LoggedIn();
  }
}
