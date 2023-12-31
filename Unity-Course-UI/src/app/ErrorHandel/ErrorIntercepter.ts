import { HTTP_INTERCEPTORS, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable, InjectionToken } from "@angular/core";
import { Observable, catchError, throwError } from "rxjs";

@Injectable()
export class ErrorInspecter implements HttpInterceptor{
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError(error=>{
                if(error.status===401)
                {
                   return throwError(error.statusText)
                } 
                if(error instanceof HttpErrorResponse)
                {
                    const ApplicationError=error.headers.get("Application-Error")
                    if(ApplicationError)
                    {
                        return throwError(ApplicationError)
                    }
                    const serverError=error.error
                    let modelStatueErrors=''
                    if(serverError.errors && typeof serverError.errors==="object")
                    {
                        for(const key in serverError.errors)
                        {
                            if(serverError.errors[key])
                            {
                                modelStatueErrors+=serverError.errors[key]+'\n'
                            }
                        }
                    }
                    return throwError(modelStatueErrors || serverError || 'server error')
                }
                return throwError('server error')
            })
        )
    }
    
    
}
