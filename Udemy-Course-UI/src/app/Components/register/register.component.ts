import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Auth } from '../../Models/User';
import { AuthService } from '../../_service/Auth.service';
import { AlertifyService } from '../../_service/alertify.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { User } from '../../Models/UserDTO';
import { Router } from '@angular/router';
import { UserToRegister } from '../../Models/UserToRegistDtO';
import { CredentialResponse,PromptMomentNotification } from 'google-one-tap'
import { GoogleSigninButtonModule, SocialAuthService } from '@abacritt/angularx-social-login';
import { newUserFromGoogle } from '../../Models/newRegisterFormGoogle';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit  {
  constructor(private service:AuthService,
    private Alertify:AlertifyService,private fb:FormBuilder,
    private router:Router,private socialAuthServices:SocialAuthService){}
 @Output() cancelRegister=new EventEmitter()
 @Input()newUserData: newUserFromGoogle
 @Input ()isGoogleUser:Boolean
  registerForm!: FormGroup;
  maxDate=new Date()
  bsConfig!:Partial<BsDatepickerConfig>
  registerFromGoogle:Boolean=false;
  user:UserToRegister={
    username: '',
    password: '',
    gender: '',
    knownAs: '',
    dateOfBirth: new Date(),
    city: '',
    country: ''
  }
  ngOnInit(): void {
    this.maxDate.setFullYear(new Date().getFullYear()-18,1,1)
   this.bsConfig=Object.assign({},{
    maxDate:this.maxDate
   })
    console.log(this.isGoogleUser)
   if(this.newUserData!=undefined){
    console.log('googleuser ',this.newUserData.username)
    this.user.username=this.newUserData.username
    this.user.knownAs=this.newUserData.knownAs
    this.registerFromGoogle=true
    this.createREgisterForm2()
   }
   else
   {
    this.createREgisterForm()
   }
}



  //register forem
  createREgisterForm(){
    this.registerForm= this.fb.group({
      gender:['male'],
      username:['',Validators.required],
      knownAs:['',Validators.required],
      dateOfBirth:[null,Validators.required],
      city:['',Validators.required],
      country:['',Validators.required],
      password:['', [Validators.required,Validators.maxLength(10),Validators.minLength(8)]],
      confirmPassword:['',Validators.required]
    },{validator:this.passwordMatchValidator})
  }
  //register forem
  createREgisterForm2(){
    this.registerForm= this.fb.group({
      gender:['male'],
      username:['',Validators.required],
      knownAs:['',Validators.required],
      dateOfBirth:[null,Validators.required],
      city:['',Validators.required],
      country:['',Validators.required],
      
    })
  }
  //custom validation
  passwordMatchValidator(g:AbstractControl){
    return g.get('password')?.value===g.get('confirmPassword')?.value ? null:{'mismatch':true}
  }
  dateOfBirthValidator(date:AbstractControl){
    return date
  }

  regiser(){
    if(this.registerForm.valid)
    {
      this.user.username=this.registerForm.get('username')?.value
      this.user.password=this.registerForm.get('password')?.value
      this.user.city=this.registerForm.get('city')?.value
      this.user.country=this.registerForm.get('country')?.value
      this.user.dateOfBirth=this.registerForm.get('dateOfBirth')?.value
      this.user.gender=this.registerForm.get('gender')?.value
      this.user.knownAs=this.registerForm.get('knownAs')?.value

      this.service.Register(this.user).subscribe({
        next:()=>{
          this.service.LogIn(this.user).subscribe({
            next:(res)=>{
              this.router.navigate(['/members'])
            },
            error:(error)=>{
              this.Alertify.error(error)
            }
          })
          this.Alertify.success('Registration successfully')
        }
        ,error:(errror)=>{
          this.Alertify.error(errror)
        },
      })
    }
  }
  Cancel(){
    this.cancelRegister.emit(false)
    console.log('cancel')
  }
  // google
registerByGoogle(){
  if(this.registerForm.valid){

  
      this.newUserData.city=this.registerForm.get('city')?.value
      this.newUserData.country=this.registerForm.get('country')?.value
      this.newUserData.dateOfBirth=this.registerForm.get('dateOfBirth')?.value
      this.newUserData.gender=this.registerForm.get('gender')?.value
      this.service.RegisterWithGoogle(this.newUserData).subscribe({
        next:(response)=>{
         console.log(response)
         this.router.navigate(['/members'])
        },
        error:(error)=>{
          console.log(error)
        }
  })
}
}

}
