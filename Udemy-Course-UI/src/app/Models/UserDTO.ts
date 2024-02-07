import { Photo } from "./photos";

export interface User{
    id:number;
    password?:string;
    username:string;
    knownAs:string;
    age:number;
    gender:string;
    created?:Date;
    lastActive?:Date;
    photoUrl:string;
    city:string;
    country:string;
    interests?:string;
    introduction?:string;
    lookingFor?:string;
    photos?:Photo[];
    dateOfBirth?:Date

}