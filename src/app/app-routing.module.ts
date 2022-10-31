import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModelsListComponent } from './components/models-list/models-list.component';
import { UpdateModelComponent } from './components/update-model/update-model.component';
import { UserLoginComponent } from './components/user-login/user-login.component';
import { UserRegistrationComponent } from './components/user-registration/user-registration.component';
import { ViewModelComponent } from './components/view-model/view-model.component';

const routes: Routes = [
  { path: 'modelslist', component: ModelsListComponent },
  { path: 'viewmodel', component: ViewModelComponent },
  { path: 'updatemodel', component: UpdateModelComponent },
  { path: 'register', component: UserRegistrationComponent },
  { path: '', component: UserLoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
