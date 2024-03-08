import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../../../Models/UserDTO';
import { UserService } from '../../../_service/user.service';
import { AlertifyService } from '../../../_service/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../_service/Auth.service';
import { TabsetComponent } from 'ngx-bootstrap/tabs';


@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.css',
})
export class MemberDetailComponent implements OnInit {
  @ViewChild ('memberTabs',{static:true}) memberTabs:TabsetComponent
  user:User
  imges:string[]=[
  ]
  previewImage=false
  showMask=false
  showCount=true
  currentLightboxImage=this.imges[0]
  currentIndex=0
  controles=true
  totalImageCount=0

  constructor(private userService:UserService,private alertify:AlertifyService,
    private route:ActivatedRoute,private authservice:AuthService){}
  ngOnInit(): void {
    this.LoadeUser()
    this.route.queryParams.subscribe(params=>{
      const selectedTab=params['tab']
      this.memberTabs.tabs[selectedTab>0?selectedTab:0].active=true
    })
   
  }
  LoadeUser(){
    return this.userService.GetUser(+this.route.snapshot.params['id']).subscribe({
      next:(result)=>{
        this.user=result
        this.getImages()
        console.log(this.user.photoUrl)
      },
      error:(error)=>{
        console.log(error)
        this.alertify.error(error)
      }
    })
  }

  SendLike(){
    this.userService.sendLike(this.authservice.decodedToken.userId,+this.route.snapshot.params['id']).subscribe({
      next:(response)=>{
        this.alertify.success('you have liked '+ this.user.knownAs)
      },
      error:(error)=>{
        this.alertify.error(error)
      }
    })
  }

  getImages(){
    
    this.user.photos?.forEach(photo=>{
      this.imges.push(photo.url)
    })
    this.totalImageCount=this.imges.length
  }
  onPreviewImage(index:number){
    this.showMask=true
    this.previewImage=true
    this.currentIndex=index
    this.currentLightboxImage=this.imges[index]
  }

 
  onClosePreview(){
    this.previewImage=false
    this.showMask=false
  }
  prev(){
    this.currentIndex=this.currentIndex-1
    if(this.currentIndex<0)
    {
      this.currentIndex=this.imges.length-1
    }
    this.currentLightboxImage=this.imges[this.currentIndex]
  }
  next(){
    this.currentIndex=this.currentIndex+1
    if(this.currentIndex>this.imges.length-1)
    {
      this.currentIndex=0
    }
    this.currentLightboxImage=this.imges[this.currentIndex]
  }
  selectTab(tabId:number){
    this.memberTabs.tabs[tabId].active=true;
  }
}
