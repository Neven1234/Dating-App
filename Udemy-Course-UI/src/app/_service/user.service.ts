import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { User } from '../Models/UserDTO';

const HttpOptions={
  headers:new HttpHeaders({
    'Authorization':'Bearer '+localStorage.getItem('token')
  })
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl=environment.baseUrl
  constructor(private http:HttpClient) { }

  //Get users
  GetUsers():Observable<User[]>{
    return this.http.get<User[]>(this.baseUrl+'/api/User',HttpOptions)
  }
  //get specific user
  GetUser(id:number):Observable<User>{
    return this.http.get<User>(this.baseUrl+'/api/User/'+id,HttpOptions)
  }
}
