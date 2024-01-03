import { Injectable } from '@angular/core';
import * as alertify from 'alertifyjs';

@Injectable({
  providedIn: 'root'
})
export class AlertifyService {

  constructor() { }
  //confirm
  Confirm(message:string,OkCallBack:()=>any){
    alertify.confirm(message,(e:any)=>{
      if(e){
        OkCallBack()
      }
      else{}
    })
  }
  //Success alert
  success(message:string){
    alertify.success(message);
  }
   //Error alert
   error(message:string){
    alertify.error(message);
  }
   //worrning alert
   worrning(message:string){
    alertify.warning(message);
  }
   //Success alert
   message(message:string){
    alertify.message(message);
  }
}
