import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { JwtTokenService } from '../jwt-token/jwt-token.service';
import { UserLoginService } from '../user-login/user-login.service';

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptorService implements HttpInterceptor {
  constructor (
    private injector: Injector
  )
  {}
  
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authservice = this.injector.get(JwtTokenService);
    const jWTTokenDetails: any = authservice.getJWTTokenDetails();
    const jWTToken = jWTTokenDetails.jwtToken;
    let authreq = request;
    authreq = this.AddJWTheader(request, jWTToken);
    return next.handle(authreq).pipe(
      catchError(errordata => {
        if (errordata.status === 401) {
          return this.handleRefrehJWT(request, next);
        }
        return throwError(errordata);
      })
    );
  }

  handleRefrehJWT(req: HttpRequest<any>, next: HttpHandler) {
    const userLoginService = this.injector.get(UserLoginService);
    const jwtTokenService = this.injector.get(JwtTokenService);
    const jWTTokenDetails: any = jwtTokenService.getJWTTokenDetails();
    const formData = new FormData();
    formData.append('userId', jWTTokenDetails.userId);
    formData.append('refreshToken', jWTTokenDetails.refreshToken);
    formData.append('jwtToken', jWTTokenDetails.jwtToken);
    return userLoginService.refreshJWTSession(formData).pipe(
      switchMap((res: any) => {
        const jwtTokenService = this.injector.get(JwtTokenService);
        jwtTokenService.setJWTToken(res);
        return next.handle(this.AddJWTheader(req, res.jwtToken));
      }),
      catchError(errordata => {
        const userLoginService = this.injector.get(UserLoginService);
        userLoginService.logOut();
        return throwError(errordata);
      })
    );
  }
  
  AddJWTheader(request: HttpRequest<any>, jwtToken: any): any {
    return request.clone (
      { headers: request.headers.set('Authorization', 'bearer ' + jwtToken) }
    );
  }

}
