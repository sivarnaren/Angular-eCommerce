import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService, NotificationService, GooglePlacesService } from 'src/app/services';
import * as moment from 'moment';
import { ShippingAddressModel, GenderModel, State } from 'src/app/models';

@Component({
  selector: 'app-account-information',
  templateUrl: './account-information.component.html',
  styleUrls: ['./account-information.component.less']
})
export class AccountInformationComponent implements OnInit, AfterViewInit {
  @ViewChild('billingAddress') billingAdress: ElementRef;
  @ViewChild('shippingAddress') shippingAddress: ElementRef;

  startDate = new Date(1990, 0, 1);

  shippingAdressList: ShippingAddressModel[] = [];
  genderList: GenderModel[];

  userInfoForm: FormGroup;
  newAddressForm: FormGroup;
  stateList: State[];

  constructor(
    private fb: FormBuilder,
    private notificationSrv: NotificationService,
    private googleSrvPlaces: GooglePlacesService,
    private accountSrv: AccountService
  ) {
    this.userInfoForm = this.fb.group(
      {
        member_id: ['', []],
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        gender_id: [0, [Validators.required, Validators.min(1)]],
        gender: ['', [Validators.required]],
        birthday: [Date(), [Validators.required]],
        // billing address
        member_address: ['', []],
        address1: ['', [Validators.required]],
        address2: ['', []],
        city: [{ value: '', disabled: true }, [Validators.required]],
        state: [{ value: '', disabled: true }, [Validators.required]],
        zipCode: [{ value: '', disabled: true }, [Validators.required]],
        latitude: ['', []],
        longitude: ['', []],
        // shipping_addresses
        shipping_addresses: fb.array([]),
        // phones
        billingPhoneId: ['', []],
        billingPhone: ['', [Validators.required]],
        cellPhoneId: ['', []],
        cellPhone: [{ value: '', disabled: false }, [Validators.required]]
      },
      {}
    );
    this.newAddressForm = this.fb.group(
      {
        nickname: ['', [Validators.required]],
        defaultShipping: [false, [Validators.required]],
        address1: ['', [Validators.required]],
        address2: ['', []],
        city: [{ value: '', disabled: true }, [Validators.required]],
        state: [{ value: '', disabled: true }, [Validators.required]],
        zipcode: [{ value: '', disabled: true }, [Validators.required]],
        latitude: [0, []],
        longitude: [0, []]
      },
      {}
    );
  }

  ngOnInit() {
    this.stateList = JSON.parse(localStorage.getItem('stateList'));
    this.accountSrv.getUserData().subscribe(res => {
      if (!res.HasError) {
        const userData = res.Result;
        this.shippingAdressList = userData.userShippings;
        this.genderList = JSON.parse(localStorage.getItem('genderList'));
        this.updateUserForm(userData.userData[0], userData.userPhones);
        this.shippingAdressList.forEach(address => {
          this.addShippingaddress(address);
        });
      } else {
        this.notificationSrv.showError(res.Message);
      }
    });
  }
  ngAfterViewInit() {
    this.googleSrvPlaces
      .loadMaps(this.billingAdress, this.setBillingAddress.bind(this))
      .then(() => {
        console.log('Google maps loaded');
      })
      .catch(error => {
        console.error('error loading map', error);
      });

    this.googleSrvPlaces
      .loadMaps(this.shippingAddress, this.setShippingAddress.bind(this))
      .then(() => {
        console.log('Google maps loaded');
      })
      .catch(error => {
        console.error('error loading map', error);
      });
  }

  createShippingAddress() {
    if (this.shippingAdressList.length < 1) {
      this.newAddressForm.patchValue({
        defaultShipping: true
      });
    }
    const newAdress = this.newAddressForm.getRawValue();
    this.accountSrv.createShippingAddress(newAdress).subscribe(res => {
      if (!res.HasError) {
        const userData = res.Result;
        this.shippingAdressList = userData.userShippings;
        this.clearFormArray(this.userInfoForm.controls.shipping_addresses as FormArray);

        this.shippingAdressList.forEach(address => {
          this.addShippingaddress(address);
        });
        this.notificationSrv.showSuccess(res.Message);
        this.clearNewAddressForm();
      } else {
        this.notificationSrv.showError(res.Message);
      }
    });
  }
  removeShippingAddress(index) {
    const addresId = this.shippingAdressList[index].member_address;

    if (addresId) {
      this.accountSrv.deleteAddress(addresId).subscribe(res => {
        if (!res.HasError) {
          this.shippingAdressList.splice(index, 1);
          this.deleteAdress(index);
          this.notificationSrv.showSuccess('shipping address deleted');
        } else {
          this.notificationSrv.showError(res.Message);
        }
      });
    }
  }

  saveUserData() {
    // TODO: Check the phone number data how to display all phone numbers
    const userFormData = this.userInfoForm.getRawValue();
    this.accountSrv.updateUserData(userFormData).subscribe(res => {
      if (!res.HasError) {
        this.notificationSrv.showSuccess(res.Message);
      } else {
        this.notificationSrv.showError(res.Message);
      }
    });
  }

  updateUserForm(userData, userPhones) {
    this.userInfoForm.patchValue({
      member_id: userData.member_id,
      firstName: userData.first_name,
      lastName: userData.last_name,
      gender: userData.gender,
      gender_id: userData.gender_id,
      birthday: moment(userData.date_of_birth).format('YYYY-MM-DD'),
      member_address: userData.member_address,
      address1: userData.address1,
      address2: userData.address2 ? userData.address2 : '',
      city: userData.city,
      state: userData.state,
      zipCode: userData.zipcode,
      latitude: userData.latitude ? userData.latitude : 0,
      longitude: userData.longitude ? userData.longitude : 0,
      billingPhoneId: userPhones[0].member_phone ? userPhones[0].member_phone : 0,
      billingPhone: userPhones[0].phone_number ? userPhones[0].phone_number : 0,
      cellPhoneId: userPhones[1] ? userPhones[1].member_phone : 0,
      cellPhone: userPhones[1] ? userPhones[1].phone_number : ''
    });
  }

  addShippingaddress(address?: ShippingAddressModel) {
    const fg = this.fb.group({
      member_address: [address.member_address, [Validators.required]],
      nickname: [address.nickname, [Validators.required]],
      defaultShipping: [address.is_default, []],
      address1: [address.address1, [Validators.required]],
      address2: [address.address2, []],
      city: [address.city, [Validators.required]],
      state: [address.state, [Validators.required]],
      zipcode: [address.zipcode, [Validators.required]],
      latitude: [address.latitude, []],
      longitude: [address.longitude, []]
    });
    (this.userInfoForm.get('shipping_addresses') as FormArray).push(fg);
  }

  deleteAdress(index: number) {
    (this.userInfoForm.get('shipping_addresses') as FormArray).removeAt(index);
  }

  clearNewAddressForm() {
    this.newAddressForm.setValue({
      nickname: '',
      defaultShipping: false,
      address1: '',
      address2: '',
      city: '',
      state: '',
      zipcode: '',
      latitude: 0,
      longitude: 0
    });
  }

  setBillingAddress(address1: string, city: string, state: string, zipCode: string, latitude: number, longitude: number) {
    this.userInfoForm.controls.address1.setValue(address1);
    this.userInfoForm.controls.city.setValue(city);
    this.userInfoForm.controls.state.setValue(state);
    this.userInfoForm.controls.zipCode.setValue(zipCode);
    this.userInfoForm.controls.latitude.setValue(latitude);
    this.userInfoForm.controls.longitude.setValue(longitude);
  }

  setShippingAddress(address1: string, city: string, state: string, zipCode: string, latitude: number, longitude: number) {
    this.newAddressForm.controls.address1.setValue(address1);
    this.newAddressForm.controls.city.setValue(city);
    this.newAddressForm.controls.state.setValue(state);
    this.newAddressForm.controls.zipcode.setValue(zipCode);
    this.newAddressForm.controls.latitude.setValue(latitude);
    this.newAddressForm.controls.longitude.setValue(longitude);
  }
  clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
    // tslint:disable-next-line: semicolon
  };

  sameAsBilling(checked: boolean) {
    if (!checked) {
      const billingphone = this.userInfoForm.get('billingPhone').value;

      this.userInfoForm.controls.cellPhone.setValue(billingphone);
      this.userInfoForm.controls.cellPhone.disable();
    } else {
      this.userInfoForm.controls.cellPhone.enable();
    }
  }
  setDefaultShipping(selectedIndex) {
    const selectedAddress = this.shippingAdressList[selectedIndex];
    selectedAddress.is_default = true;
    this.shippingAdressList.splice(selectedIndex, 1);
    this.shippingAdressList.forEach((address, index) => {
      address.is_default = false;
    });
    this.shippingAdressList.unshift(selectedAddress);
    this.clearFormArray(this.userInfoForm.controls.shipping_addresses as FormArray);

    this.shippingAdressList.forEach(address => {
      this.addShippingaddress(address);
    });
  }

  // user form getters
  get firstName() {
    return this.userInfoForm.get('firstName');
  }
  get lastName() {
    return this.userInfoForm.get('lastName');
  }
  get birthday() {
    return this.userInfoForm.get('birthday');
  }
  get member_address() {
    return this.userInfoForm.get('member_address');
  }
  get address1() {
    return this.userInfoForm.get('address1');
  }
  get address2() {
    return this.userInfoForm.get('address2');
  }
  get city() {
    return this.userInfoForm.get('city');
  }
  get state() {
    return this.userInfoForm.get('state');
  }
  get zipCode() {
    return this.userInfoForm.get('zipCode');
  }
  get latitude() {
    return this.userInfoForm.get('latitude');
  }
  get longitude() {
    return this.userInfoForm.get('longitude');
  }
  get billingPhone() {
    return this.userInfoForm.get('billingPhone');
  }
  get cellPhone() {
    return this.userInfoForm.get('cellPhone');
  }
  get addressList() {
    // tslint:disable-next-line: no-string-literal
    return this.userInfoForm.get('shipping_addresses')['controls'];
  }
  get sameAsBillingPhone() {
    return this.userInfoForm.get('state');
  }
}
