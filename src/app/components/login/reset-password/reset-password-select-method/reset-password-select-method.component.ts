import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService, NotificationService } from 'src/app/services';
import { ReCaptchaV3Service } from 'ngx-captcha';
import { PasswordValidator } from 'src/app/validators';
import { environment } from 'src/environments/environment';
import { TranslateService } from 'src/app/translator/translate.service';

@Component({
  selector: 'app-reset-password-select-method',
  templateUrl: './reset-password-select-method.component.html',
  styleUrls: ['./reset-password-select-method.component.less']
})
export class ResetPasswordSelectMethodComponent implements OnInit {
  @Input() step: number;
  @Output() action: EventEmitter<number> = new EventEmitter<number>();
  siteKey = environment.recaptchaSiteKey;

  resetForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private accountSrv: AccountService,
    private translate: TranslateService,

    private notificationSrv: NotificationService,
    private reCaptchaV3Service: ReCaptchaV3Service
  ) {}

  ngOnInit() {
    this.resetForm = this.fb.group(
      {
        email: ['', [Validators.email, Validators.required]],
        phone: [{ value: '', disabled: true }],
        recaptcha: ['', Validators.required],
        currentStep: [this.step]
      },
      {
        validator: PasswordValidator.LookEmptyness // your validation method
      }
    );
    this.reCaptchaV3Service.execute(
      this.siteKey,
      'homepage',
      token => {
        this.resetForm.patchValue({ recaptcha: token });
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

  resetPassword() {
    const formValue = this.resetForm.value;

    this.accountSrv.resetPassSendCode(formValue).subscribe(res => {
      if (!res.HasError) {
        this.accountSrv.setUserEmail(formValue.email);
        const maskedEmail = res.Result.CodeDeliveryDetails.Destination ? res.Result.CodeDeliveryDetails.Destination : formValue.email;
        this.accountSrv.setUserEmailMasked(maskedEmail);

        this.userAction('advance');
      } else {
        this.notificationSrv.showError(res.Message);
      }
    });
  }
  get email() {
    return this.resetForm.get('email');
  }
}
