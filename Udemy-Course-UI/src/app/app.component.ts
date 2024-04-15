import { Component, OnInit } from '@angular/core';
import { AuthService } from './_service/Auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from './Models/UserDTO';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  constructor(private auth:AuthService){}
  title = 'udemy-Course-UI';
  jwtHelper= new JwtHelperService();
  user:User={
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
    lookingFor: ''
  }
  ngOnInit(): void {
    const token=localStorage.getItem('token')
    var temp=localStorage.getItem('user')
    if(temp!=undefined)
    {
      console.log(JSON.parse(temp))
      this.user=JSON.parse(temp)
    }
    
    if(token){
      this.auth.decodedToken=this.jwtHelper.decodeToken(token)
    }
    if(this.user){
      this.auth.currenUser=this.user
      this.auth.changeMemberPhoto(this.user.photoUrl)
    }
    
  }
}
