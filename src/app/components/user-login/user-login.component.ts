import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtTokenService } from 'src/app/services/jwt-token/jwt-token.service';
import { UserLoginService } from 'src/app/services/user-login/user-login.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {

  protected loginForm: FormGroup = this.initModelForm();
  private email: string = "";
  private password: string = "";
  protected showLoadingIcon: boolean = true;
  protected errorMsg: string = "";
  protected errorOccured: boolean = false;

  constructor(
    private userLoginService: UserLoginService,
    private router: Router,
    private jwtTokenService: JwtTokenService
  ) {}

  ngOnInit() {
    this.loginForm = this.initModelForm();
    this.showLoadingIcon = false;
  }

  initModelForm(): FormGroup {
    return new FormGroup({
      email: new FormControl(
        null, 
        Validators.required
      ),
      password: new FormControl(
        null, 
        Validators.required
      )
    });
  }

  onLoginFormSubmit(): void {
    const formData = new FormData();
    for (const key of Object.keys(this.loginForm.value)) {
      const value = this.loginForm.value[key];
      formData.append(key, value);
    }

    this.showLoadingIcon = true;
    this.userLoginService.loginUser(formData)
    .subscribe({
      next: response => {
        const loginTokenDetails = response;
        this.jwtTokenService.setJWTToken(loginTokenDetails);
        this.showLoadingIcon = false;
        this.routeToModelsList();
        console.log("Login successfully!");
      },
      error: err => {
        if (err.status == 400) {
          this.showLoadingIcon = false;
          this.errorOccured = true;
          this.errorMsg = "Invalid email or password"
        }
      }
    });
  }

  routeToModelsList(): void {
    this.router.navigateByUrl("/modelslist")
  }

}
