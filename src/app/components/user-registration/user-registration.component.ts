import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenServiceService } from 'src/app/services/token-service/token-service.service';
import { UserRegisterService } from 'src/app/services/user-register/user-register.service';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css']
})
export class UserRegistrationComponent implements OnInit {
  protected registerForm: FormGroup = this.initModelForm();
  private displayName="";
  private userName="";
  private email="";
  private password="";
  protected OTPSent: boolean=false;
  protected emailConfirmed: boolean=false;
  protected OTPErrorMsg: string="";
  protected OTPError: boolean=false;
  protected sendEmailError: boolean=false;
  protected sendEmailMsg: string="";

  showLoadingIcon: boolean = true;
  
  constructor(
    private userRegisterService: UserRegisterService,
    private router: Router,
    private tokenService: TokenServiceService
  ) { }

  ngOnInit() {
    this.registerForm = this.initModelForm();
    this.showLoadingIcon = false;
  }

  initModelForm(): FormGroup {
    return new FormGroup({
      displayName: new FormControl(
        null, 
        Validators.required
      ),
      userName: new FormControl(
        null, 
        Validators.required
      ),
      email: new FormControl(
        null, 
        Validators.required
      ),
      OTP: new FormControl(
        null, 
        Validators.required
      ),
      password: new FormControl(
        null, 
        Validators.required
      )
    });
  }
  
  sendOTPEmail(): void {
    const formData = new FormData();
    const email = this.registerForm.value['email']
    const toEmailPropetName = "toEmail";
    formData.append(toEmailPropetName, email);

    this.showLoadingIcon = true;
    this.userRegisterService.sendOTPEmail(formData)
    .subscribe({
      next: response => {
        this.OTPSent = response;
        this.sendEmailError = false;
        this.showLoadingIcon = false;
      },
      error: err => {
        if (err.error == 'emailexists'){
          this.sendEmailError = true;
          this.sendEmailMsg = "A profile with this email already exists, try another email";
          this.showLoadingIcon = false;
        }
      }
    });
  }

  onRegisterFormSubmit(): void {
    const formData = new FormData();
    for (const key of Object.keys(this.registerForm.value)) {
      const value = this.registerForm.value[key];
      formData.append(key, value);
    }
    const isNotAdminPropertyName = "isNotAdmin";
    formData.append(isNotAdminPropertyName, "false");

    this.showLoadingIcon = true;
    this.userRegisterService.registerUser(formData)
    .subscribe({
      next: response => {
        const JWTToken = response;
        this.tokenService.setToken(JWTToken);
        this.OTPError = false;
        this.showLoadingIcon = false;
        this.routeToModelsList();
        console.log("Registered successfully!");
      },
      error: err => {
        console.log(err.error);
        this.showLoadingIcon = false;
        this.OTPError = true;
        this.OTPErrorMsg = "Your entered OTP doesn't match from the one sent to your email!"
      }
    });
  }

  routeToModelsList(): void {
    this.router.navigateByUrl("/")
  }
}
