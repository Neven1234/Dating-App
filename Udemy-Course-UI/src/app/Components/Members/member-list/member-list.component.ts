import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../_service/user.service';
import { AlertifyService } from '../../../_service/alertify.service'; 
import { User } from '../../../Models/UserDTO'; 
import { Pagination } from '../../../Models/Pagination';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.css'
})
export class MemberListComponent implements OnInit {
  users: User[] = [];
  pageNumber=1
  pageSize=5;
  pagination:Pagination={
    currentPage: 1,
    itemPerPage: 0,
    totalItems: 0,
    totalPages: 0
  }
  page: number;
  constructor(private userService:UserService,private alertify:AlertifyService){}
  ngOnInit(): void {
    this.loadUsers()
  }
  loadUsers(){
    this.userService.GetUsers(this.pagination.currentPage,5).subscribe({
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
