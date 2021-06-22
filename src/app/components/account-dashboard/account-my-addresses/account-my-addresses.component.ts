import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SignupService } from 'src/app/services';
import { AccountService, NotificationService, GooglePlacesService, AddressValidationService } from './../../../services/index';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-account-my-addresses',
  templateUrl: './account-my-addresses.component.html',
  styleUrls: ['./account-my-addresses.component.less']
})
export class AccountMyAddressesComponent implements OnInit {

  public shippingAddresses = [];
  public states = [];
  public addressForm: FormGroup;
  public updateAddressForm: FormGroup;
  public selectedAddress;

  public modalEdit;
  public modalDelete;
  public invalidAddressModal;
  public selectedProcess: string;

  @ViewChild('address') address: ElementRef;
  @ViewChild('addressUpdate') addressUpdate: ElementRef;
  @ViewChild('invalidAddressContent') invalidAddressContent: ElementRef;

  constructor(
    private accountSrv: AccountService,
    private notificationSrv: NotificationService,
    private fb: FormBuilder,
    private signupSrv: SignupService,
    private googlePlaceSrv: GooglePlacesService,
    private modalSrv: NgbModal,
    private addressValidationSrv: AddressValidationService
  ) { }

  ngOnInit() {

    this.addressForm = this.fb.group({
      address1: ['', [Validators.required]],
      address2: '',
      city: ['', [Validators.required]],
      state: [null, [Validators.required]],
      stateName: [''],
      stateAbbreviation: [''],
      zipCode: ['', [Validators.required]],
      country: ['', [Validators.required]]
    });

    this.updateAddressForm = this.fb.group({
      address1Update: ['', [Validators.required]],
      address2Update: '',
      cityUpdate: ['', [Validators.required]],
      stateUpdate: [null, [Validators.required]],
      stateNameUpdate: [''],
      stateAbbreviationUpdate: [''],
      zipCodeUpdate: ['', [Validators.required]],
      countryUpdate: ['', [Validators.required]],
      memberAddressId: ''
    });

    this.getShippingAddresses();
    this.getStates();
  }

  // tslint:disable-next-line
  ngAfterViewInit() {
    this.googlePlaceSrv.loadMaps(this.address, this.setAddress).then(() => {
      console.log('Google maps loaded');
    }).catch(error => {
      console.log('error loading map', error);
    });

    console.log(this.addressUpdate);
    this.googlePlaceSrv.loadMaps(this.addressUpdate, this.setAddressModal).then(() => {
      console.log('Google maps loaded UPDATE');
    }).catch(error => {
      console.log('error loading map', error);
    });
  }

  public getShippingAddresses() {
    this.accountSrv.getUserData().subscribe(response => {
      if (!response.HasError) {
        this.shippingAddresses = [];
        this.shippingAddresses = response.Result.userShippings;
      } else {
        this.notificationSrv.showError(response.Message);
      }
    });
  }

  getStates() {
    this.signupSrv.getCommonFormData().subscribe(
      response => {
        if (!response.HasError) {
          this.states = response.Result.stateList;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  setAddress = (city: string, state: string, zipCode: string, latitude: number, longitude: number, country: string, address: string) => {
    this.address1.setValue(address);
    this.city.setValue(city);
    this.zipCode.setValue(zipCode);
    this.country.setValue(country);

    this.states.forEach(item => {
      if (item.abbreviation === state) {
        this.state.setValue(item.id);
        this.stateName.setValue(state);
        this.stateAbbreviation.setValue(item.abbreviation);
      }
    });
  }

  setAddressModal = (
    city: string,
    state: string,
    zipCode: string,
    latitude: number,
    longitude: number,
    country: string,
    address: string
  ) => {
    this.address1Update.setValue(address);
    this.cityUpdate.setValue(city);
    this.zipCodeUpdate.setValue(zipCode);
    this.countryUpdate.setValue(country);

    this.states.forEach(item => {
      if (item.abbreviation === state) {
        this.stateUpdate.setValue(item.id);
        this.stateNameUpdate.setValue(state);
        this.stateAbbreviationUpdate.setValue(item.abbreviation);
      }
    });
  }

  openInvalidAddressModal(content) {
    this.invalidAddressModal = this.modalSrv.open(content);
  }

  closeInvalidAddressModal() {
    this.invalidAddressModal.close();
    document.getElementById('linkid').click();
  }

  openModalDeleteAddress(content) {

    // this.modalEdit.close();
    this.modalDelete = this.modalSrv.open(content);

  }

  openModal(address) {
    this.selectedAddress = address;

    this.address1Update.setValue(address.address1);
    this.address2Update.setValue(address.address2);
    this.cityUpdate.setValue(address.city);
    this.zipCodeUpdate.setValue(address.zipcode);
    this.countryUpdate.setValue(address.country);
    this.stateUpdate.setValue(address.state_id);
    this.stateNameUpdate.setValue(address.state_name);
    this.stateAbbreviationUpdate.setValue(address.state_abbreviation);
    this.memberAddressId.setValue(address.member_address_id);

  }

  public keepAddressAsEntered() {

    if (this.selectedProcess === 'add') {

      this.createShippingAddress();

    } else if (this.selectedProcess === 'update') {

      this.updateShippingAddress();

    }
    this.closeInvalidAddressModal();

  }

  resetCreateAddressForm() {

    this.addressForm.reset();
    this.state.setValue(null);

  }

  resetUpdateAddressForm() {

    this.updateAddressForm.reset();
    this.state.setValue(null);

  }

  public async validateAddress(process: string) {

    this.selectedProcess = process;

    const address = {
      city: null,
      state: null,
      zipcode: null
    };

    if (process === 'add') {

      address.city = this.city.value;
      address.state = this.stateAbbreviation.value;
      address.zipcode = this.zipCode.value;

    } else if (process === 'update') {

      address.city = this.cityUpdate.value;
      address.state = this.stateAbbreviationUpdate.value;
      address.zipcode = this.zipCodeUpdate.value;

    }

    const addressValidation = await this.addressValidationSrv.validateAddress(address).toPromise();

    if (addressValidation.valid_address) {

      if (process === 'add') {

        this.createShippingAddress();

      } else if (process === 'update') {

        this.updateShippingAddress();

      }

    } else {
      this.openInvalidAddressModal(this.invalidAddressContent);
    }


  }

  public createShippingAddress() {
    this.accountSrv.createShippingAddress(this.addressForm.getRawValue()).subscribe(response => {
      if (!response.HasError) {
        this.resetCreateAddressForm();
        this.getShippingAddresses();
        this.notificationSrv.showSuccess(response.Message);
      } else {
        this.notificationSrv.showError(response.Message);
      }
    });
  }

  public updateShippingAddress() {

    const request = {
      address1: this.address1Update.value,
      address2: this.address2Update.value,
      city: this.cityUpdate.value,
      state: this.stateUpdate.value,
      zipCode: this.zipCodeUpdate.value,
      memberAddressId: this.memberAddressId.value
    };

    this.accountSrv.updateShippingAddress(request).subscribe(response => {
      if (!response.HasError) {
        this.resetUpdateAddressForm();
        this.getShippingAddresses();
        this.notificationSrv.showSuccess(response.Message);
      } else {
        this.notificationSrv.showError(response.Message);
      }
    });

  }

  public removeShippingAddress() {

    const request = {
      addressId: this.selectedAddress.member_address_id
    };

    this.accountSrv.deleteAddress(request).subscribe((response) => {
      if (!response.HasError) {
        this.notificationSrv.showSuccess(response.Message);
        this.modalDelete.close();
        document.getElementById('linkid').click();
        this.getShippingAddresses();
      } else {
        this.notificationSrv.showError(response.Message);
      }
    });

  }

  public setDefaultShippingAddress(shippingAddressId: number) {

    const request = {
      addressId: shippingAddressId
    };

    this.accountSrv.setDefaultShippingAddress(request).subscribe((response) => {
      if (!response.HasError) {
        this.notificationSrv.showSuccess(response.Message);
        this.getShippingAddresses();
      } else {
        this.notificationSrv.showError(response.Message);
      }
    }, error => { console.log(error); });

  }

  // Getters New Address

  get address1() {
    return this.addressForm.controls.address1;
  }

  get address2() {
    return this.addressForm.controls.address2;
  }

  get city() {
    return this.addressForm.controls.city;
  }

  get state() {
    return this.addressForm.controls.state;
  }

  get stateName() {
    return this.addressForm.controls.stateName;
  }

  get stateAbbreviation() {
    return this.addressForm.controls.stateAbbreviation;
  }

  get zipCode() {
    return this.addressForm.controls.zipCode;
  }

  get country() {
    return this.addressForm.controls.country;
  }

  // Getters Update Address

  get memberAddressId() {
    return this.updateAddressForm.controls.memberAddressId;
  }

  get address1Update() {
    return this.updateAddressForm.controls.address1Update;
  }

  get address2Update() {
    return this.updateAddressForm.controls.address2Update;
  }

  get cityUpdate() {
    return this.updateAddressForm.controls.cityUpdate;
  }

  get stateUpdate() {
    return this.updateAddressForm.controls.stateUpdate;
  }

  get stateNameUpdate() {
    return this.updateAddressForm.controls.stateNameUpdate;
  }

  get stateAbbreviationUpdate() {
    return this.updateAddressForm.controls.stateAbbreviationUpdate;
  }

  get zipCodeUpdate() {
    return this.updateAddressForm.controls.zipCodeUpdate;
  }

  get countryUpdate() {
    return this.updateAddressForm.controls.countryUpdate;
  }

}
