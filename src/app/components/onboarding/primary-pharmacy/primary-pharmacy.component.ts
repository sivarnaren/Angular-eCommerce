import { PharmacyModel } from './../../../models/index';
import { AddressModel, OnboardingRequestModel } from './../../../models/index';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { GooglePlacesService, PharmaciesService, OnboardingService, NotificationService } from '../../../services/index';

@Component({
  selector: 'app-primary-pharmacy',
  templateUrl: './primary-pharmacy.component.html',
  styleUrls: ['./primary-pharmacy.component.less']
})
export class PrimaryPharmacyComponent implements OnInit, AfterViewInit {
  @Input() step: number;
  @Output() action: EventEmitter<number> = new EventEmitter<number>();
  @ViewChild('address') address: ElementRef;
  public shippingAddress: AddressModel = new AddressModel();
  public pharmacies: Array<PharmacyModel> = new Array<PharmacyModel>();

  public limitItems = 3;
  public primaryPharmacyAddress = null;
  public openedWindow = 0;

  public default = 'My Address';

  constructor(
    private googleSrvPlaces: GooglePlacesService,
    private pharmacySrv: PharmaciesService,
    private onboardingSrv: OnboardingService,
    private notificationSrv: NotificationService
  ) { }

  ngOnInit() {
    this.getUserLocation();
    console.log(navigator.language);
  }

  ngAfterViewInit() {
    this.googleSrvPlaces
      .loadMaps(this.address, this.setAddress)
      .then(() => {
        console.log('Google maps loaded');
      })
      .catch(error => {
        console.log('error loading map', error);
      });
  }

  setAddress = (city: string, state: string, zipCode: string, latitude: number, longitude: number, country: string, address: string) => {
    this.shippingAddress.city = city;
    this.shippingAddress.state = state;
    this.shippingAddress.zipCode = zipCode;
    this.shippingAddress.latitude = latitude;
    this.shippingAddress.longitude = longitude;
    this.shippingAddress.address1 = address;
    this.primaryPharmacyAddress = null;
    this.loadNearestPharmacies(this.shippingAddress.latitude, this.shippingAddress.longitude);
    // tslint:disable-next-line: semicolon
  };

  loadNearestPharmacies(lat: number, long: number) {
    const pharmacyModel = new PharmacyModel();
    pharmacyModel.latitude = lat;
    pharmacyModel.longitude = long;
    this.pharmacies = [];
    this.pharmacySrv.getNearestPharmacies(pharmacyModel).subscribe(
      response => {
        console.log(response);
        if (!response.HasError) {
          this.pharmacies = response.Result;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  userAction(action: string) {
    const step = action === 'back' ? (this.step = 2) : (this.step = 4);
    this.action.emit(step);
  }

  private getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.shippingAddress.latitude = position.coords.latitude;
        this.shippingAddress.longitude = position.coords.longitude;
        this.loadNearestPharmacies(this.shippingAddress.latitude, this.shippingAddress.longitude);
      });
    }
  }

  openWindow(pharmacy, unshift) {
    this.primaryPharmacyAddress = pharmacy;
    if (unshift) {

      const index = this.pharmacies.findIndex(o => o.pharmacy_id === this.primaryPharmacyAddress.pharmacy_id);
      this.pharmacies.splice(index, 1);
      this.pharmacies.unshift(pharmacy);
      this.openedWindow = pharmacy.pharmacy_id;

    } else {
      this.openedWindow = pharmacy.pharmacy_id;
    }
  }

  isInfoWindowOpen(id) {
    return this.openedWindow === id;
  }

  completeOnboarding() {
    const onboardingModel = new OnboardingRequestModel();
    onboardingModel.pharmacyId = this.primaryPharmacyAddress.pharmacy_id;
    onboardingModel.currentStep = this.step;
    this.onboardingSrv.onboarding(onboardingModel).subscribe(response => {
      if (!response.HasError) {
        this.userAction('advance');
      } else {
        this.notificationSrv.showError(response.Message);
      }
    });
  }

  selectPharmacy(pharmacy) {
    this.primaryPharmacyAddress = pharmacy;
    this.openWindow(this.primaryPharmacyAddress, false);
  }
}
