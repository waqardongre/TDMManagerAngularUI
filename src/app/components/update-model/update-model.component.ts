import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModelsListService } from 'src/app/services/models-list/models-list.service';
import { UpdateModelService } from 'src/app/services/update-model/update-model.service';

@Component({
  selector: 'app-update-model',
  templateUrl: './update-model.component.html',
  styleUrls: ['./update-model.component.css']
})
export class UpdateModelComponent implements OnInit {

  protected modelName: string = "";
  protected attachedFile: string = "";
  private modelId: number = -1;
  protected updateModelForm: FormGroup = this.initModelForm();
  protected showLoadingIcon: boolean = true;
  protected supportedModels: string = ".glb";
  
  constructor (
    private modelsListService: ModelsListService,
    private updateModelService: UpdateModelService,
    private router: Router,
  )
  {}

  ngOnInit() {
    this.modelsListService.modelCurrent.subscribe((modelObj) => {
      this.modelId = modelObj.modelId;
      this.modelName = modelObj.modelName;
      
      this.updateModelForm = this.initModelForm();
      this.updateModelForm.patchValue({
        modelName: this.modelName,
        id: this.modelId
      });
    });
    
    this.showLoadingIcon = false;
  }

  initModelForm(): FormGroup {
    return new FormGroup({
      modelIFormFile: new FormControl(
        null, 
        Validators.required
      ),
      modelFile: new FormControl(
        null, 
        Validators.required
      ),
      modelName: new FormControl(
        null, 
        Validators.required
      ),
      id: new FormControl(
        null, 
        Validators.required
      )
    });
  }

  onModelFileChanged(event: any): void {
    if (event.target.files.length > 0) {
      const modelFile = event.target.files[0];
      this.modelName = modelFile.name;
      this.attachedFile = modelFile.name;
      this.updateModelForm.patchValue({
        modelIFormFile: modelFile,
        modelName: this.modelName
      });
    }
  }

  modelNameChanged(event: any): void {
    this.modelName = this.updateModelForm.value['modelName'];
  }

  onModelUpdateSubmit(): void {
    this.showLoadingIcon = true;

    const formData = new FormData();
    for (const key of Object.keys(this.updateModelForm.value)) {
      const value = this.updateModelForm.value[key];
      formData.append(key, value);
    }

    this.updateModelForm = this.initModelForm();

    this.updateModelService.modelUpdate(this.modelId, formData)
    .subscribe({
      next: response => {
        this.attachedFile = "";
        this.showLoadingIcon = false;
        console.log("Updated successfully!");
        this.routeToModelsList();
      },
      error(err) {
        console.log(err.error);
      }
    });
  }

  routeToModelsList(): void {
    this.router.navigateByUrl("/")
  }
}
