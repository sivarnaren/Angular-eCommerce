import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountService, NotificationService } from 'src/app/services';
import { PasswordValidator } from 'src/app/validators';
import { ReCaptchaV3Service } from 'ngx-captcha';

import { SendPassResetConfirmationRequestModel } from 'src/app/models';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-account-security',
  templateUrl: './account-security.component.html',
  styleUrls: ['./account-security.component.less']
})
export class AccountSecurityComponent implements OnInit {
  @Input() step: number;
  @Output() action: EventEmitter<number> = new EventEmitter<number>();
  siteKey = environment.recaptchaSiteKey;

  passwordForm: FormGroup;

  textPinForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private accountSrv: AccountService,
    private notificationSrv: NotificationService,
    private reCaptchaV3Service: ReCaptchaV3Service,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    {
    }
  }

  ngOnInit() {
    this.passwordForm = this.fb.group(
      {
        currentPass: ['', [Validators.required]],
        recaptcha: ['', Validators.required],
        pwd: [
          '',
          [
            Validators.required,
            PasswordValidator.patternValidator(/\d/, { hasNumber: true }),
            PasswordValidator.patternValidator(/[A-Z]/, {
              hasCapitalCase: true
            }),
            PasswordValidator.patternValidator(/[a-z]/, { hasSmallCase: true }),
            PasswordValidator.patternValidator(/[!@#$%^&*(),.?":{}|<>]/, {
              hasSpecialCharacters: true
            }),
            Validators.minLength(8)
          ]
        ],

        confirm: ['', [Validators.required]]
      },
      { validator: PasswordValidator.checkPasswordEquality }
    );
    this.textPinForm = this.fb.group({
      pin: ['', [Validators.required, PasswordValidator.checkLimit(4, 6)]]
    });
    this.reCaptchaV3Service.execute(
      this.siteKey,
      'homepage',
      token => {
        this.passwordForm.patchValue({ recaptcha: token });
      },
      {
        useGlobalDomain: false // optional
      }
    );
  }
  userAction(action: string) {
    const step = action === 'back' ? (this.step -= 1) : (this.step += 1);
    this.action.emit(step);
  }

  sendPasswordForm() {
    const formValue = this.passwordForm.value;

    this.accountSrv.changePassSecurity(formValue).subscribe(res => {
      if (!res.HasError) {
        this.notificationSrv.showSuccess(res.Message);
        this.notificationSrv.showInfo('you need to login again');

        sessionStorage.setItem('token', '');
        this.router.navigate(['../login'], { relativeTo: this.activatedRoute });
      } else {
        this.notificationSrv.showError(res.Message);
      }
    });
  }
  goToDashboard() {
    this.router.navigate(['../../account'], { relativeTo: this.activatedRoute });
  }
  sendTextPinForm() {
    const formValue = this.textPinForm.value;
    this.accountSrv.changePinSecurity(formValue).subscribe(res => {
      if (!res.HasError) {
        this.notificationSrv.showSuccess('pin changed');
      } else {
        this.notificationSrv.showError(res.Message);
      }
    });
  }

  get currentPass() {
    return this.passwordForm.get('currentPass');
  }
  get pwd() {
    return this.passwordForm.get('pwd');
  }

  get confirm() {
    return this.passwordForm.get('confirm');
  }
  get pin() {
    return this.textPinForm.get('pin');
  }
}
