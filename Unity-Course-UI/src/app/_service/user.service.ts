import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { user } from '../Models/User';
import { map } from 'rxjs/operators'
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) { }
  baseURL:string=environment.baseUrl;

  //login
  public LogIn(user:user){
    return this.http.post(this.baseURL+'/api/User/Login',user)
    .pipe(
      map((response:any)=>{
        const user=response;
        if(user){
          localStorage.setItem('token',user.token)
        }
      })
    )
  
  }
  //regiter
  public Register(user:user){
    return this.http.post(this.baseURL+'/api/User/register',user)
  }
}
