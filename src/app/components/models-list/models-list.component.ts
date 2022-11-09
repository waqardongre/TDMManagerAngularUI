import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModelsListService } from 'src/app/services/models-list/models-list.service';
import { JwtTokenService } from 'src/app/services/jwt-token/jwt-token.service';

@Component({
  selector: 'app-models-list',
  templateUrl: './models-list.component.html',
  styleUrls: ['./models-list.component.css']
})
export class ModelsListComponent implements OnInit {
  
  protected supportedModels: string;
  protected showLoadingIcon: boolean = true;
  protected modelsList: any[] = [];
  protected uploadModelForm: FormGroup = this.initModelForm();
  protected showDeleteDiv: boolean = false;
  private validationMessage: string = "";
  private tDModelName: string = "";
  private isModelValid: boolean = false;
  
  private deleteModelId: number = -1;
  private jwtToken: string = "";
  protected email: string = "";
  protected loggedIn: boolean = false;
  private userId: string = "";
  protected attachedModelDTOObjList: any = Array();
  protected count$: any;

  constructor (
    private modelsListService: ModelsListService,
    private router: Router,
    private jwttokenservice: JwtTokenService
  ) {
    this.supportedModels = ".glb";
  }

  ngOnInit(): void {
    const tokenDetailsDict: any = this.jwttokenservice.getJWTTokenDetails();
    const jwtToken = tokenDetailsDict.jwtToken;
    this.email = tokenDetailsDict.email;
    this.uploadModelForm = this.initModelForm();
    this.userId = tokenDetailsDict.userId;
    this.loggedIn = jwtToken == "" ? false : true;
    if (this.loggedIn) {
      this.getModelsList();
    }
    else {
      this.showLoadingIcon = false;
      this.router.navigateByUrl("/");
    }
  }
  
  initModelForm(): FormGroup {
    return new FormGroup({
      tDModelDTOIEnumerable:  new FormControl(
        null,
        Validators.required 
      ),
      modelFile:  new FormControl(
        null,
        Validators.required 
      )
    });
  }

  getModelsList(): void {
    this.showLoadingIcon = true;
    this.modelsListService.getModelsList(this.userId)
    .subscribe({
      next: response => {
        this.showLoadingIcon = false;
        const modelsList = response;
        const modelsPathListLength = modelsList.length;
        this.modelsList = [];
        for (let i = 0; i < modelsPathListLength ; i++) {
          let modelName = modelsList[i].modelName;
          let modelId = modelsList[i].id;
          let email = modelsList[i].email;
          let modelObj = {
            modelId: modelId,
            modelName: modelName,
            email: email
          }
          this.modelsList.push(modelObj);
        }
      },
      error: err => {
        console.log('Error in getModelsList(): ', err.message);
      }
    });
  }

  routeToViewModel(modelObj: string): void {
    this.router.navigateByUrl("/viewmodel");
    this.modelsListService.modelCurrentUpdate(modelObj);
  }

  routeToUpdateModel(modelObj: any): void {
    this.router.navigateByUrl("/updatemodel");
    this.modelsListService.modelCurrentUpdate(modelObj);
  }

  deleteModel(modelId: number): void {
    this.showDeleteDiv = true;
    this.deleteModelId = modelId;
  }

  onModelFileChanged(event: any): void {
    if (event.target.files.length > 0) {
      const modelFiles: any = event.target.files;
      
      for (let index = 0; index < modelFiles.length; index++) {
        const modelIFormFile: any = modelFiles[index];
        this.attachedModelDTOObjList.push(modelIFormFile);
      }
      this.uploadModelForm.patchValue({
        tDModelDTOIEnumerable: this.attachedModelDTOObjList
      });
    }
  }

  onModelSubmit(): void {
    if (this.uploadModelForm.valid) {
      this.showLoadingIcon = true;
      const key = 'tDModelDTOIEnumerable';
      const modelIFormFileList: any = this.uploadModelForm.value[key];
      
      this.uploadModelForm = this.initModelForm();
      
      const modelPropertyName = 'modelIFormFile';
      const userIdPropertyName = 'userId';
      const emailPropertyName = 'email';
      const modelsLength = modelIFormFileList.length;
      let uploadCount = 0
      for (let index = 0; index < modelsLength; index++) {
        const modelIFF: any = modelIFormFileList[index];
        const formData = new FormData();
        formData.append(modelPropertyName, modelIFF);
        const _userId: string = this.userId == undefined ? "" : this.userId;
        formData.append(userIdPropertyName, _userId);
        const _email: string = this.email == undefined ? "" : this.email;
        formData.append(emailPropertyName, _email);
        
        this.modelsListService.modelUpload(formData)
        .subscribe({
          next: (response) => {
            uploadCount += 1;
            if (uploadCount == modelsLength) {
              this.showLoadingIcon = false;
              console.log('Your 3D model(s) uploaded successfully!');
              this.getModelsList();
            }
          },
          error: (err)=> {
            console.log(err.error);
          }
        });
      }
    }
    else {
      this.validateAllFormFields(this.uploadModelForm);  
    }
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
          } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  deleteBtnYes(): void {
    this.showDeleteDiv = false;
    this.showLoadingIcon = true;
    this.modelsListService.deleteModel(this.deleteModelId)
    .subscribe({
      next: response => {
        this.showLoadingIcon = false;
        console.log("Deleted successfully!");
        this.getModelsList();
      },
      error(err) {
        console.log(err.error);
      }
    });
    this.deleteModelId = -1;
  }

  deleteBtnNo(): void {
    this.showDeleteDiv = false;
    this.deleteModelId = -1;
  }

  userLogout(): void {
    this.showLoadingIcon = true;
    localStorage.clear();
  }

}
