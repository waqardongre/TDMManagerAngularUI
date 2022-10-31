import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DOTNETCOREAPI } from 'src/app/app.component';

@Injectable({
  providedIn: 'root'
})
export class ViewModelService {

  constructor(
    private httpClient: HttpClient
  ) {}

  getModel(requestHeaderOptions: any, modelId: number): Observable<any> {
    return this.httpClient
    .get<any> (
      DOTNETCOREAPI+ 'api/tdmodels/'+ modelId,
      requestHeaderOptions
    )
  }
}
