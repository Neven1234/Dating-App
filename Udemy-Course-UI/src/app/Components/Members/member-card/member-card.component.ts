import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../../Models/UserDTO';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.css'
})
export class MemberCardComponent implements OnInit {
 @Input() user:User={
   id: 0,
   username: '',
   knownAs: '',
   age: 0,
   gender: '',
   created: new Date(),
   lastActive: new Date(),
   photoUrl: '',
   city: '',
   country: '',
   lookingFor: ''
 }
  ngOnInit(): void {
    
  }

}
