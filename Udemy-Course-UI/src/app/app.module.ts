import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LightgalleryModule } from 'lightgallery/angular';
import { TimeagoModule } from "ngx-timeago";
import { ButtonsModule } from 'ngx-bootstrap/buttons';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './Components/nav/nav.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './_service/Auth.service';
import { HomeComponent } from './Components/home/home.component';
import { RegisterComponent } from './Components/register/register.component';
import {  ErrorInspecter } from './ErrorHandel/ErrorIntercepter';
import { BsDropdownModule,  } from 'ngx-bootstrap/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { MemberListComponent } from './Components/Members/member-list/member-list.component';
import { MessagesComponent } from './Components/messages/messages.component';
import { ListsComponent } from './Components/lists/lists.component';
import { MemberCardComponent } from './Components/Members/member-card/member-card.component';
import { MemberDetailComponent } from './Components/Members/member-detail/member-detail.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { MemberEditComponent } from './Components/Members/member-edit/member-edit.component';
import { PreventUnsavedChanges } from './_guards/prevent-unsavedChanges.guard';
import { PhotoEditorComponent } from './Components/Members/photo-editor/photo-editor.component';
import { JwtModule } from '@auth0/angular-jwt';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { MemberMessagesComponent } from './Components/Members/member-messages/member-messages.component';
import { InfiniteScrollModule } from "ngx-infinite-scroll";

import { SocialLoginModule,SocialAuthServiceConfig, GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login'



export function TokenGetter(){
  return localStorage.getItem('token')
}


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
    MemberEditComponent,
    PhotoEditorComponent,
    MemberMessagesComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BsDropdownModule.forRoot(),
    JwtModule.forRoot({
      config:{
        tokenGetter:TokenGetter,
        allowedDomains:['localhost:8088'],
        disallowedRoutes:['localhost:8088/api/auth']
      }
    }),
    TabsModule.forRoot(),
    LightgalleryModule,
    BsDatepickerModule.forRoot(),
    TimeagoModule.forRoot(),
    PaginationModule.forRoot(),
    ButtonsModule.forRoot(),
    InfiniteScrollModule,
    GoogleSigninButtonModule

  ],
  providers: [
    AuthService,
    {
        provide: HTTP_INTERCEPTORS,
        useClass: ErrorInspecter,
        multi: true
    },
    PreventUnsavedChanges,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '41236342619-pah3dkvkj2gq3ligp8gbjv9ido6jftvc.apps.googleusercontent.com',{
                oneTapEnabled:false,
                prompt:'consent',
              }
              
            )
          },
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
