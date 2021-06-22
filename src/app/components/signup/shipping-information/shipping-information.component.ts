import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-shipping-information',
  templateUrl: './shipping-information.component.html',
  styleUrls: ['./shipping-information.component.less']
})
export class ShippingInformationComponent implements OnInit {


  @Input() step: number;
  @Output() action: EventEmitter<number> = new EventEmitter<number>();

  constructor() {}

  ngOnInit() {}

  userAction(action: string) {
    const step = action === 'back' ? (this.step = 3) : (this.step = 5);
    this.action.emit(step);
  }
}
