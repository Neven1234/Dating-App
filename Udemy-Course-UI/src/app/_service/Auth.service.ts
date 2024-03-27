import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Auth } from '../Models/User';
import { map } from 'rxjs/operators'
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject } from 'rxjs';
import { User } from '../Models/UserDTO';
import { UserToRegister } from '../Models/UserToRegistDtO';
import { googleDTO } from '../Models/googleRegisterDTO';
import { newUserFromGoogle } from '../Models/newRegisterFormGoogle';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) { }
  baseURL:string=environment.baseUrl;
  jwtHelper= new JwtHelperService();
  newUserWithGoogle:boolean=false
  decodedToken:any;
  currenUser:User={
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
  
  photoUrl=new BehaviorSubject<string>('../../assets/user.png')
  currentPhotoUrl=this.photoUrl.asObservable()


 //change photo
 changeMemberPhoto(photourl:string){
    this.photoUrl.next(photourl)
  }

  //login
  public  LogIn(user:any){
    return this.http.post(this.baseURL+'/api/Auth/Login',user)
    .pipe(
      map((response:any)=>{
        const user=response;
        if(user!=undefined){
          localStorage.setItem('token',user.token)
          localStorage.setItem('user',JSON.stringify(user.user))
          this.decodedToken=this.jwtHelper.decodeToken(user.token)
          
          console.log('decoded: ', this.decodedToken)
          console.log(this.decodedToken.name)
          this.currenUser=user.user
          this.changeMemberPhoto(this.currenUser.photoUrl)
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
  public Register(user:UserToRegister){
   
    return this.http.post(this.baseURL+'/api/Auth/register',user)
  }

  //LoginWithGoogle
  public LoginWithGoogle(googleDTO:googleDTO)
  {
    return this.http.post(this.baseURL+'/api/Auth/googleLogin',googleDTO)
    .pipe(
      map((response:any)=>{
        const user=response;
        if(user!=undefined){
          if(user.register==true)
          {
            this.newUserWithGoogle=true
          }
          else{
            localStorage.setItem('token',user.token)
            localStorage.setItem('user',JSON.stringify(user.user))
            this.decodedToken=this.jwtHelper.decodeToken(user.token)
          
            console.log('decoded: ', this.decodedToken)
            console.log(this.decodedToken.name)
            this.currenUser=user.user
            this.changeMemberPhoto(this.currenUser.photoUrl)
          }
          
        }
      })
    )
  }

  public RegisterWithGoogle(user:newUserFromGoogle)
  {
    return this.http.post(this.baseURL+'/api/Auth/googleRegister',user)
    .pipe(
        map((response:any)=>{
          const user=response;
          if(user!=undefined){
            localStorage.setItem('token',user.token)
            localStorage.setItem('user',JSON.stringify(user.user))
            this.decodedToken=this.jwtHelper.decodeToken(user.token)
            
            console.log('decoded: ', this.decodedToken)
            console.log(this.decodedToken.name)
            this.currenUser=user.user
            this.changeMemberPhoto(this.currenUser.photoUrl)
          }
        })
    )
    
  }
}
