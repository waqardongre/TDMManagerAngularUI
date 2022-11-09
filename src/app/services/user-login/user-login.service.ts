import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DOTNETCOREAPI } from 'src/app/app.component';

@Injectable({
  providedIn: 'root'
})
export class UserLoginService {

  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) 
  {}

  loginUser(formData: FormData):Observable<any> {
    return this.httpClient
    .post (
      DOTNETCOREAPI + 'api/token/authenticate',
      formData
    );
  }

  logOut(): void {
    localStorage.clear();
    this.router.navigateByUrl("/");
  }

  refreshJWTSession(formData: FormData):Observable<any> {
    return this.httpClient
    .post (
      DOTNETCOREAPI + 'api/token/refresh',
      formData
    );
  }

}
