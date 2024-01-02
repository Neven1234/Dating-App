import { Component, OnInit } from '@angular/core';
import { UserService } from './_service/user.service';
import { JwtHelperService } from '@auth0/angular-jwt';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  constructor(private userService:UserService){}
  title = 'Unity-Course-UI';
  jwtHelper= new JwtHelperService();
  ngOnInit(): void {
    const token=localStorage.getItem('token')
    if(token){
      this.userService.decodedToken=this.jwtHelper.decodeToken(token)
    }
  }
}
