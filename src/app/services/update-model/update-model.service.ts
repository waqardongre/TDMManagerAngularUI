import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DOTNETCOREAPI } from 'src/app/app.component';

@Injectable({
  providedIn: 'root'
})
export class UpdateModelService {

  constructor(
    private httpClient: HttpClient
  )
  {}

  modelUpdate(requestHeaderOptions: any, modelId: number, formData: FormData):Observable<any> {
    return this.httpClient
    .put (
      DOTNETCOREAPI + 'api/tdmodels/' + modelId,
      formData,
      requestHeaderOptions
    );
  }
}
