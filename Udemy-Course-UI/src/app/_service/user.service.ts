import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { User } from '../Models/UserDTO';
import { Photo } from '../Models/photos';

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
  //update user
  UpdateUser(id:number,user:User){
    return this.http.put(this.baseUrl+'/api/User/'+id,user,HttpOptions)
  }

  //uploadImage
  UploadImage(fileToUpload:File,userId:number):Observable<Photo>
  {
    const formData = new FormData();

    formData.append('file', fileToUpload, fileToUpload.name);
    return this.http.post<Photo>(this.baseUrl+'/api/User/'+userId+'/Photos',formData,HttpOptions)
  }
  //set main photo
  setMainPhoto(userId:number,id:number){
    return this.http.post(this.baseUrl+'/api/User/'+userId+'/Photos/'+id+'/setMain',{},HttpOptions)
  }

  //delete photo
  deletePhoto(userId:number,id:number){
    return this.http.delete(this.baseUrl+'/api/User/'+userId+'/Photos/'+id,HttpOptions)
  }
}
