import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LightgalleryModule } from 'lightgallery/angular'

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './Components/nav/nav.component';
import { FormsModule } from '@angular/forms';
import { AuthService } from './_service/Auth.service';
import { HomeComponent } from './Components/home/home.component';
import { RegisterComponent } from './Components/register/register.component';
import {  ErrorInspecter } from './ErrorHandel/ErrorIntercepter';
import { BsDropdownModule,  } from 'ngx-bootstrap/dropdown';
import { MemberListComponent } from './Components/Members/member-list/member-list.component';
import { MessagesComponent } from './Components/messages/messages.component';
import { ListsComponent } from './Components/lists/lists.component';
import { MemberCardComponent } from './Components/Members/member-card/member-card.component';
import { MemberDetailComponent } from './Components/Members/member-detail/member-detail.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { MemberEditComponent } from './Components/Members/member-edit/member-edit.component';
import { PreventUnsavedChanges } from './_guards/prevent-unsavedChanges.guard';




@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    RegisterComponent,
    MemberListComponent,
    MessagesComponent,
    ListsComponent,
    MemberCardComponent,
    MemberDetailComponent,
    MemberEditComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    LightgalleryModule
  ],
  providers: [
    AuthService,
    {
        provide: HTTP_INTERCEPTORS,
        useClass: ErrorInspecter,
        multi: true
    },
    PreventUnsavedChanges
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
