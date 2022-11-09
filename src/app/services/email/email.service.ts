import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DOTNETCOREAPI } from 'src/app/app.component';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(
    private httpClient: HttpClient
  )
  { }

  sendOTPEmail(formData: FormData):Observable<any> {
    return this.httpClient
    .post (
      DOTNETCOREAPI + 'api/email',
      formData
    );
  }
}
