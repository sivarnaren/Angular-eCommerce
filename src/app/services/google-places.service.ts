import { MapsAPILoader } from '@agm/core';
import { Injectable, NgZone, ElementRef } from '@angular/core';

@Injectable()
export class GooglePlacesService {
  constructor(private mapsAPILoader: MapsAPILoader, private ngZone: NgZone) { }
  // tslint:disable-next-line
  loadMaps(addressReference: ElementRef, fn: Function): Promise<any> {
    return this.mapsAPILoader.load().then(() => {
      const autocomplete = new google.maps.places.Autocomplete(addressReference.nativeElement, {
        componentRestrictions: { country: 'us' }
      });
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          place.address_components.forEach(addressComponent => { });

          console.log(place);

          let zipcode = '';
          let city = '';
          let state = '';
          let route = '';
          let num = '';
          let country = '';
          const address = place.formatted_address;

          const longitude = place.geometry.location.lng();
          const latitude = place.geometry.location.lat();
          place.address_components.forEach(addressComponent => {
            if (addressComponent.types.includes('administrative_area_level_1')) {
              state = addressComponent.short_name;
            } else if (addressComponent.types.includes('locality')) {
              city = addressComponent.long_name;
            } else if (addressComponent.types.includes('postal_code')) {
              zipcode = addressComponent.long_name;
            } else if (addressComponent.types.includes('route')) {
              route = addressComponent.long_name;
            } else if (addressComponent.types.includes('street_number')) {
              num = addressComponent.long_name;
            } else if (addressComponent.types.includes('country')) {
              country = addressComponent.short_name;
            }
          });

          // Record geocoding results.
          // const ps = [num, route].filter(Boolean);
          fn(city, state, zipcode, latitude, longitude, country, address);
        });
      });
    });
  }
}
