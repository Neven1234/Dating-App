import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../_service/user.service';
import { AlertifyService } from '../../../_service/alertify.service'; 
import { User } from '../../../Models/UserDTO'; 
import { Pagination } from '../../../Models/Pagination';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { UserPrams } from '../../../Models/userPrams';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.css'
})
export class MemberListComponent implements OnInit {
  users: User[] = [];
  
  user:User
  pageNumber=1
  pageSize=5;
  pagination:Pagination={
    currentPage: 1,
    itemPerPage: 0,
    totalItems: 0,
    totalPages: 0
  }
  page: number;
  genderList=[{value:'male',display:'Males'},{value:'female',display:'Females'}]
  userPrams:UserPrams={
    minAge: 18,
    maxAge: 90,
    orderBy: 'lastActive'
  }
  constructor(private userService:UserService,private alertify:AlertifyService){}
  ngOnInit(): void {
    var temp=localStorage.getItem('user')
    if(temp!=undefined)
    {
      console.log(JSON.parse(temp))
      this.user=JSON.parse(temp)
    }
    this.loadUsers()
  }
  loadUsers(){
    this.userService.GetUsers(this.pagination.currentPage,5,this.userPrams).subscribe({
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
  resetFilters(){
    this.userPrams.minAge=18
    this.userPrams.maxAge=90;
    this.userPrams.gender=undefined
    this.loadUsers()
  }

}
