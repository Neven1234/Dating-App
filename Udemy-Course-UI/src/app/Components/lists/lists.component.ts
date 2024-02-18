import { Component, OnInit } from '@angular/core';
import { User } from '../../Models/UserDTO';
import { AlertifyService } from '../../_service/alertify.service';
import { UserService } from '../../_service/user.service';
import { Pagination } from '../../Models/Pagination';
import { AuthService } from '../../_service/Auth.service';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.css'
})
export class ListsComponent implements OnInit {
  users: User[] = [];
  
  user:User
  pageNumber=1
  pageSize=5;
  likesParam='likees'
  pagination:Pagination={
    currentPage: 1,
    itemPerPage: 0,
    totalItems: 0,
    totalPages: 0
  }
  constructor(private userService:UserService,
    private alertify:AlertifyService,
    private authservice:AuthService){}
  ngOnInit(): void {
    this.loadUsers()
    console.log(this.pagination.totalPages)
    console.log(this.pagination.itemPerPage)
  }

  loadUsers(){
    this.userService.GetUsers(this.pagination.currentPage,5,null,this.likesParam).subscribe({
      next:(respons)=>{
        this.users=respons.result
        this.pagination=respons.pagination
      },
      error:(error)=>{
        this.alertify.error(error)
      }
    })
  }
    pageChanged(event: PageChangedEvent): void {
      this.pagination.currentPage= event.page;
      console.log('tstt ',this.pagination.currentPage)
      this.loadUsers()
     }
}
