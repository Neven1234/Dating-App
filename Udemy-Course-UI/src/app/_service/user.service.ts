import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, map } from 'rxjs';
import { User } from '../Models/UserDTO';
import { Photo } from '../Models/photos';
import { PaginatedResult } from '../Models/Pagination';
import { Message } from '../Models/Message';

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
  GetUsers(page?:any,itemPerPage?:any,userPrams?:any,likesPrame?:any):Observable<PaginatedResult<User[]>>{
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
    if(likesPrame==='likers'){
      params=params.append('likers',true)
    }
    if(likesPrame==='likees'){
      params=params.append('likees',true)
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

  //Like
  sendLike(id:number,recipientId:number)
  {
    return this.http.post(this.baseUrl+'/api/User/'+id+'/like/'+recipientId,{})
  }

  removeLike(id:number,recipientId:number)
  {
    return this.http.delete(this.baseUrl+'/api/User/'+id+'/like/'+recipientId)
  }

  //Messages
  getMessages(userId:number,page?:any,itemPerPage?:any,messsageContainer?:any){
    const paginatedResult:PaginatedResult<Message[]>=new PaginatedResult<Message[]>();
    let params=new HttpParams();
    params=params.append('MessageContainer',messsageContainer)
    if(page!=null && itemPerPage!=null){
      params=params.append('pageNumber',page)
      params=params.append('pageSize',itemPerPage)
    } 
    return this.http.get<Message[]>(this.baseUrl+'/api/users/'+userId+'/Messages',{observe:'response',params})
    .pipe(
      map(response=>{
        paginatedResult.result=response.body
        if(response.headers.get('Pagination')!=null){
          paginatedResult.pagination=JSON.parse(response.headers.get('Pagination')!)
        }
        return paginatedResult;
      })
    )
  }
  getMessageThread(id:number,recipoientId:number){
    return this.http.get<Message[]>(this.baseUrl+'/api/users/'+id+'/Messages/thread/'+recipoientId)
  }
  sendMessage(id:number,message:Message)
  {
    return this.http.post<Message>(this.baseUrl+'/api/users/'+id+'/Messages',message)
  }
  deleteMessage(id:number,userId:number){
    return this.http.delete(this.baseUrl+'/api/users/'+userId+'/Messages/'+id)
  }
  markAsSeen(userId:number,id:number){
     this.http.post(this.baseUrl+'/api/users/'+userId+'/Messages/'+id+'/Seen',{})
     .subscribe();
  }
}
