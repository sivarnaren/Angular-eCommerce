import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reset-password-step3',
  templateUrl: './reset-password-step3.component.html',
  styleUrls: ['./reset-password-step3.component.less']
})
export class ResetPasswordStep3Component implements OnInit {
  @Input() step: number;
  @Output() action: EventEmitter<number> = new EventEmitter<number>();
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {}

  goToHome() {
    this.router.navigate(['../login'], { relativeTo: this.activatedRoute });
  }
}
