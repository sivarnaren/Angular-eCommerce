import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import {APIResponse, Content} from './../../models/index';
import {ContentService} from './../../services/index';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.less']
})
export class ProductComponent implements OnInit {

  content: Content;
  languages = [{value: 'en-US', name: 'en-US'}, {value: 'es-ES', name: 'es-ES'}];
  default = 'en-US';
  error = '';
  public productForm: FormGroup;

  constructor(private contentSrv: ContentService, private route: ActivatedRoute, private fb: FormBuilder) {
   }

  ngOnInit() {
    /*this.route.paramMap.subscribe(params => {
      this.idProduct = parseInt(params.get('id'), 10);
      if (this.idProduct) {
        this.getContentPatientEducation();
      }
    });*/

    this.productForm = this.fb.group({
      idProduct: ['', [Validators.required]],
      language: [ {value: this.languages[0].value } , Validators.required],
    });

    this.productForm.controls.language.setValue(this.default, {onlySelf: true});


    this.route.paramMap.subscribe(params => {
      const productId = parseInt(params.get('id'), 10);
      if (productId) {
        this.productForm.controls.idProduct.setValue(productId);
        console.log(this.productForm.controls);
        this.getContentPatientEducation();
      }
    });

  }

  getContentPatientEducation() {
    console.log(this.productForm.value);
    this.error = '';
    this.content = null;
    this.contentSrv.getPatientEducation(this.productForm.value).subscribe(result => {
      if (result.HasError) {
        this.error = result.Message;
      } else {
          this.content = result.Result;
      }
    });
  }

}
