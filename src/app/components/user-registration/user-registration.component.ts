import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtTokenService } from 'src/app/services/jwt-token/jwt-token.service';
import { UserRegisterService } from 'src/app/services/user-register/user-register.service';
import { EmailService } from 'src/app/services/email/email.service';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css']
})
export class UserRegistrationComponent implements OnInit {
  protected registerForm: FormGroup = this.initModelForm();
  private displayName='';
  private userName='';
  private email='';
  private password='';
  protected OTPSent: boolean=false;
  protected emailConfirmed: boolean=false;
  protected OTPErrorMsg: string='';
  protected OTPError: boolean=false;
  protected OTPInput: string='';
  protected sendEmailError: boolean=false;
  protected sendEmailMsg: string='';

  protected showLoadingIcon: boolean = true;
  private OTP: string = '';
  protected userNameMsg: string = '';
  protected userNameError: boolean = false;
  
  constructor (
    private userRegisterService: UserRegisterService,
    private emailService: EmailService,
    private router: Router,
    private jwtTokenService: JwtTokenService
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
    const toEmailPropetName = 'toEmail';
    formData.append(toEmailPropetName, email);
    
    this.showLoadingIcon = true;
    this.emailService.sendOTPEmail(formData)
    .subscribe({
      next: response => {
        this.sendEmailMsg = '';
        this.OTP = response;
        this.OTPSent = true;
        this.showLoadingIcon = false;
      },
      error: err => {
        if (err.error == 'emailexists'){
          this.sendEmailError = true;
          this.sendEmailMsg = 'A profile with this email already exists, try another email';
          this.showLoadingIcon = false;
        }
        else {
          this.sendEmailError = true;
          this.sendEmailMsg = 'Error while sending confirmation OTP email, check your internet connectivity!';
          this.showLoadingIcon = false;
        }
      }
    });
  }

  onRegisterFormSubmit(): void {
    this.OTPInput = this.registerForm.value['OTP'];
    if (this.OTPInput == this.OTP) {
      const formData = new FormData();
      for (const key of Object.keys(this.registerForm.value)) {
        const value = this.registerForm.value[key];
        formData.append(key, value);
      }
      const isNotAdminPropertyName = 'isNotAdmin';
      formData.append(isNotAdminPropertyName, 'false');
  
      this.showLoadingIcon = true;
      this.userRegisterService.registerUser(formData)
      .subscribe({
        next: response => {
          const loginTokenDetails = response;
          this.jwtTokenService.setJWTToken(loginTokenDetails);
          this.OTPError = false;
          console.log('Registered successfully!');
          this.showLoadingIcon = false;
          this.routeToModelsList();
        },
        error: err => {
          if (err.error.text == 'usernameexists') {
            this.userNameError = true;
            this.userNameMsg = 'A profile with this username already exists, try another username';
            this.showLoadingIcon = false;
          }
          console.log(JSON.stringify(err.error));
          this.showLoadingIcon = false;
        }
      });
    }
    else {
      this.showLoadingIcon = false;
      this.OTPError = true;
      this.OTPErrorMsg = 'Your entered OTP doesn\'t match from the one sent to your email!';    
    }
  }

  routeToModelsList(): void {
    this.router.navigateByUrl('/modelslist')
  }
}
