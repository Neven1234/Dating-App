import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from "@angular/router";
import { MemberEditComponent } from "../Components/Members/member-edit/member-edit.component";
import { Observable } from "rxjs";

@Injectable()
export class PreventUnsavedChanges implements CanDeactivate<MemberEditComponent>{
    canDeactivate(component: MemberEditComponent){
        if(component.editForm.dirty)
        {
            return confirm('Are you sure you want to leave? Any unsaved changes will be lost')
        }
        return true
    }
}