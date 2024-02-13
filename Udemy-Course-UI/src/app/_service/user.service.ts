import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, map } from 'rxjs';
import { User } from '../Models/UserDTO';
import { Photo } from '../Models/photos';
import { PaginatedResult } from '../Models/Pagination';

// const HttpOptions={
//   headers:new HttpHeaders({
//     'Authorization':'Bearer '+localStorage.getItem('token')
//   })
  
// }

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl=environment.baseUrl
  constructor(private http:HttpClient) { }

  //Get users
  GetUsers(page?:any,itemPerPage?:any,userPrams?:any):Observable<PaginatedResult<User[]>>{
    const paginatedResult:PaginatedResult<User[]>=new PaginatedResult<User[]>()
    let params=new HttpParams()
    if(page!=null && itemPerPage!=null){
      params=params.append('pageNumber',page)
      params=params.append('pageSize',itemPerPage)
    }
    if(userPrams!=null)
    {
      params=params.append('minAge',userPrams.minAge)
      params=params.append('maxAge',userPrams.maxAge)
      if(userPrams.gender!=undefined)
      {
        params=params.append('gender',userPrams.gender)
      }
      params=params.append('orderBy',userPrams.orderBy)
     
    }
    return this.http.get<User[]>(this.baseUrl+'/api/User',{observe:'response',params})
    .pipe(
      map(response=>{
        paginatedResult.result=response.body
        if(response.headers.get('Pagination')!=null){
          paginatedResult.pagination=JSON.parse(response.headers.get('Pagination')!)
        }
        return paginatedResult
      })
    )
  }
  //get specific user
  GetUser(id:number):Observable<User>{
    return this.http.get<User>(this.baseUrl+'/api/User/'+id)
  }
  //update user
  UpdateUser(id:number,user:User){
    return this.http.put(this.baseUrl+'/api/User/'+id,user)
  }

  //uploadImage
  UploadImage(fileToUpload:File,userId:number):Observable<Photo>
  {
    const formData = new FormData();

    formData.append('file', fileToUpload, fileToUpload.name);
    return this.http.post<Photo>(this.baseUrl+'/api/User/'+userId+'/Photos',formData)
  }
  //set main photo
  setMainPhoto(userId:number,id:number){
    return this.http.post(this.baseUrl+'/api/User/'+userId+'/Photos/'+id+'/setMain',{})
  }

  //delete photo
  deletePhoto(userId:number,id:number){
    return this.http.delete(this.baseUrl+'/api/User/'+userId+'/Photos/'+id)
  }
}
