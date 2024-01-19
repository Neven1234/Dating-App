import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../_service/user.service';
import { AlertifyService } from '../../../_service/alertify.service'; 
import { User } from '../../../Models/UserDTO'; 

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.css'
})
export class MemberListComponent implements OnInit {
  users: User[] = [];
  constructor(private userService:UserService,private alertify:AlertifyService){}
  ngOnInit(): void {
    this.loadUsers()
  }
  loadUsers(){
    this.userService.GetUsers().subscribe({
      next:(respons)=>{
        this.users=respons
      },
      error:(error)=>{
        this.alertify.error(error)
      }
    })
  }

}
