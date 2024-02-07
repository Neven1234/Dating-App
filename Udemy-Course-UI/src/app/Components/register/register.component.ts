import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Auth } from '../../Models/User';
import { AuthService } from '../../_service/Auth.service';
import { AlertifyService } from '../../_service/alertify.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { User } from '../../Models/UserDTO';
import { Router } from '@angular/router';
import { UserToRegister } from '../../Models/UserToRegistDtO';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit  {
  constructor(private service:AuthService,
    private Alertify:AlertifyService,private fb:FormBuilder,
    private router:Router){}
 @Output() cancelRegister=new EventEmitter()

  registerForm!: FormGroup;
  bsConfig!:Partial<BsDatepickerConfig>
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
    this.bsConfig={
      containerClass:'theme-red',

    }
    this.createREgisterForm()
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
  //custom validation
  passwordMatchValidator(g:AbstractControl){
    return g.get('password')?.value===g.get('confirmPassword')?.value ? null:{'mismatch':true}
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
}
