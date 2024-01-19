import { Component, OnInit } from '@angular/core';
import { User } from '../../../Models/UserDTO';
import { UserService } from '../../../_service/user.service';
import { AlertifyService } from '../../../_service/alertify.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.css'
})
export class MemberDetailComponent implements OnInit {
  user:User={
    id: 0,
    username: '',
    knownAs: '',
    age: 0,
    gender: '',
    created: new Date,
    lastActive: new Date,
    photoUrl: '',
    city: '',
    country: '',
    lookingFor: ''
  }

  constructor(private userService:UserService,private alertify:AlertifyService,private route:ActivatedRoute){}
  ngOnInit(): void {
    this.LoadeUser()
    // this.galleryOptions = [
    //   {
    //       width: '500px',
    //       height: '500px',
    //       thumbnailsColumns: 4,
    //       imagePercent:100,
    //       imageAnimation: NgxGalleryAnimation.Slide,
    //       preview:false
    //   },
    //]
   
  }
  LoadeUser(){
    return this.userService.GetUser(+this.route.snapshot.params['id']).subscribe({
      next:(result)=>{
        this.user=result
        console.log(this.user.photoUrl)
      },
      error:(error)=>{
        console.log(error)
        this.alertify.error(error)
      }
    })
  }
//  getImages(){
//   const imageUrls: { small: string; medium: string; big: string; }[]=[]
//   this.user.photos?.forEach(photo=>{
//     imageUrls.push({
//       small: photo.url,
//       medium: photo.url,
//       big: photo.url
//     })
//   })
//   return imageUrls
//  }

}
