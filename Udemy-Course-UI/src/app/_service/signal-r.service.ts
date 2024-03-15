import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr'
import { environment } from '../../environments/environment';
import { AuthService } from './Auth.service';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  constructor(private auth:AuthService) { }
  baseUrl=environment.baseUrl
  hubConnection : signalR.HubConnection
  startConnection=async ()=>{
    this.hubConnection=new signalR.HubConnectionBuilder()
    
    .withUrl('https://localhost:7100/chat'
      ,{
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      }
    )
    .configureLogging(signalR.LogLevel.Information)
    .build()
    await this.hubConnection.start()
    .then(()=>{
      console.log('Hub Connection Started')
    })
    .catch(err=>console.log('error wile starting connection ', err))
  }
  async JoinGroup(sender:string,recipientId:string){
    await this.hubConnection.invoke("JoinGroup",sender,recipientId)
  }

  async SeenNow(sender:string,recipientId:string){
    await this.hubConnection.invoke("MarkAsSeen",sender,recipientId)
    
  }
  
}
