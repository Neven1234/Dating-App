import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { user } from '../Models/User';
import { map } from 'rxjs/operators'
import { JwtHelperService } from '@auth0/angular-jwt';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) { }
  baseURL:string=environment.baseUrl;
  jwtHelper= new JwtHelperService();
  decodedToken:any;
  //login
  public LogIn(user:user){
    return this.http.post(this.baseURL+'/api/User/Login',user)
    .pipe(
      map((response:any)=>{
        const user=response;
        if(user){
          localStorage.setItem('token',user.token)
          this.decodedToken=this.jwtHelper.decodeToken(user.token)
          
          console.log('decoded: ', this.decodedToken)
          console.log(this.decodedToken.name)
        }
      })
    )
  
  }
  //// check validation of the token 
  LoggedIn(){
    const token=localStorage.getItem('token')
    return ! this.jwtHelper.isTokenExpired(token)
  }


  //regiter
  public Register(user:user){
    return this.http.post(this.baseURL+'/api/User/register',user)
  }
}
