import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ModelsListComponent } from './components/models-list/models-list.component';
import { UpdateModelComponent } from './components/update-model/update-model.component';
import { UserLoginComponent } from './components/user-login/user-login.component';
import { UserRegistrationComponent } from './components/user-registration/user-registration.component';
import { ViewModelComponent } from './components/view-model/view-model.component';

@NgModule({
  declarations: [
    AppComponent,
    ModelsListComponent,
    UpdateModelComponent,
    UserLoginComponent,
    UserRegistrationComponent,
    ViewModelComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
