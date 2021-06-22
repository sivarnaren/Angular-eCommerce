import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {SignupService} from '../../services/index';
import * as b64toBlob from 'b64-to-blob';
@Component({
  selector: 'app-invoice-generator',
  templateUrl: './invoice-generator.component.html',
  styleUrls: ['./invoice-generator.component.less']
})
export class InvoiceGeneratorComponent implements OnInit {

  fullBase64 = '';
  buttonText = 'Creating Invoice';

  constructor(private signupSrv: SignupService ) {

   }



  ngOnInit() {
      this.signupSrv.getInvoicePdf().subscribe(result => {
        this.fullBase64 = result.pdf_base64;
        this.buttonText = 'Print';
      });

  }

  download() {

    const contentType = 'application/pdf';
    const blob = (b64toBlob as any)(this.fullBase64, contentType);
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl);


  }

}
