import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AccountService, NotificationService, MenuService } from '../../services/index';
import { environment } from '../../../environments/environment';
import { ReCaptchaV3Service } from 'ngx-captcha';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  siteKey = environment.recaptchaSiteKey;

  constructor(
    private fb: FormBuilder,
    private accountSrv: AccountService,
    private reCaptchaV3Service: ReCaptchaV3Service,
    private notificationSrv: NotificationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private menuService: MenuService
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      recaptcha: ['', Validators.required]
    });

    this.reCaptchaV3Service.execute(
      this.siteKey,
      'homepage',
      token => {
        this.loginForm.patchValue({ recaptcha: token });
      },
      {
        useGlobalDomain: false // optional
      }
    );
  }

  doLogin() {
    this.accountSrv.signin(this.loginForm.value).subscribe(res => {
      if (!res.HasError) {
        sessionStorage.setItem('token', res.Result.token);

        this.accountSrv.member_type_id = res.Result.member_type_id;

        this.menuService.updateStatus();
        this.router.navigate(['../my-home'], { relativeTo: this.activatedRoute });
      } else {
        this.notificationSrv.showError(res.Message);
      }
    });
  }
}
