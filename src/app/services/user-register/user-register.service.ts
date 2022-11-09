import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DOTNETCOREAPI } from 'src/app/app.component';

@Injectable({
  providedIn: 'root'
})
export class UserRegisterService {

  constructor(
      private httpClient: HttpClient
  ) 
  {}

  registerUser(formData: FormData):Observable<any> {
    return this.httpClient
    .post (
      DOTNETCOREAPI + 'api/token/userregister',
      formData
    );
  }
    
}
