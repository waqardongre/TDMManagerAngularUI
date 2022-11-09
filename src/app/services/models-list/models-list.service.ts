import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DOTNETCOREAPI } from '../../app.component';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ModelsListService {
  private modelCurrentSubject: BehaviorSubject<any>;
  modelCurrent: Observable<any>;

  constructor (
    private httpClient: HttpClient
  ) {
    this.modelCurrentSubject = new BehaviorSubject({});
    this.modelCurrent = this.modelCurrentSubject.asObservable();
  }
  
  getModelsList(userId: string): Observable<any> {
    return this.httpClient
    .get<any> (
      DOTNETCOREAPI + 'api/tdmodels?userId=' + userId,
    );
  }

  modelUpload(formData: FormData):Observable<any> {
    return this.httpClient
    .post<any> (
      DOTNETCOREAPI + 'api/tdmodels',
      formData
    );
  }

  deleteModel(modelId: number):Observable<any> {
    return this.httpClient
    .delete<any> (
      DOTNETCOREAPI + 'api/tdmodels/' + modelId
    );
  }

  modelCurrentUpdate(modelObj: any): void {
    this.modelCurrentSubject.next(modelObj);
  }
}