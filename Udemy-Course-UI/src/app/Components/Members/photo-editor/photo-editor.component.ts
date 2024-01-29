import { Component, Input, OnInit } from '@angular/core';
import { Photo } from '../../../Models/photos';
import { UserService } from '../../../_service/user.service';
import { AuthService } from '../../../_service/Auth.service';
import { photoDto } from '../../../Models/photoToUploadDTO';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrl: './photo-editor.component.css'
})
export class PhotoEditorComponent implements OnInit {
 
  @Input()photos:Photo[] | undefined

  imageUrl:string=''
  fileToUpload:any
  test:any
  selectedImage=false


  constructor(private uerService:UserService,private auth:AuthService){}
  ngOnInit(): void {
    
  }

    //upload image
    handelDileInput(file:FileList){
      this.fileToUpload=file.item(0)
      var reader=new FileReader();
      reader.onload=(event:any)=>{
        this.imageUrl=event.target.result;
      }
      reader.readAsDataURL(this.fileToUpload);
      console.log('img ', this.imageUrl)
      console.log('esm el soraaa: '+ this.fileToUpload)
    }
    onSubmit(Image: any){
      this.uerService.UploadImage(this.fileToUpload,this.auth.decodedToken.userId).subscribe({
        next:(res)=>{
          console.log('id el sora ',res)
          this.selectedImage=false
          setTimeout( ()=>{
            window.location.reload()
            }, 1000)
        },
        error:(error)=>{
          console.log(error)
        }
      })
     }
    slected(){
      this.selectedImage=true
    }

}
