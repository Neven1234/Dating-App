import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  registerMode:boolean=false
  registerHandel(){
    this.registerMode=true
  }
  cancelRegisterMode(registerMode:boolean){
    this.registerMode=registerMode
    console.log('canceled')
  }
}
