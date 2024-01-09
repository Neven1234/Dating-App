import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../_service/user.service';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { AlertifyService } from '../_service/alertify.service';


export const authGuard:  CanActivateFn = (route, state) => {

  const userService=inject(UserService)
  const router=inject(Router)
  const alertify=inject(AlertifyService)
  if(userService.LoggedIn())
  {
    return true
  }
  else{
    alertify.error('please login first')
    router.navigate(['/home'])
    return false
  }
};
