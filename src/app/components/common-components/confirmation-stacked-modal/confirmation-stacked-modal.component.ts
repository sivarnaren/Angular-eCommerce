import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation-stacked-modal',
  templateUrl: './confirmation-stacked-modal.component.html',
  styleUrls: ['./confirmation-stacked-modal.component.less']
})
export class ConfirmationStackedModalComponent implements OnInit {
  action = false;

  @Input() confirmationWording = '';

  @Output() change: EventEmitter<boolean> = new EventEmitter();
  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit() {}

  confirmAction() {
    this.change.emit(true);
    this.activeModal.close('Delete');
  }
}
