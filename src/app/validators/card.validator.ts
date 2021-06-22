import { FormControl } from '@angular/forms';

export class CardValidator {
  /**
   * Luhn Algorithm
   */
  public static checkCardFormat(cardNumber: FormControl): any {
    if (cardNumber.value) {
      const digitsString = cardNumber.value;
      digitsString.replace(/\s/g, '');
      if (digitsString.length <= 1 || digitsString.match(/[^0-9 ]/)) {
        return { invalidNumber: true };
      } else {
        const checksum = Array.from(digitsString)
          .reverse()
          .map((char, index) => {
            let digit = Number(char);
            digit = index % 2 === 1 ? digit * 2 : digit;
            digit = digit > 9 ? digit - 9 : digit;
            return digit;
          })
          .reduce((previous, current) => previous + current);
        // console.log('Checksum: ', checksum % 10 === 0);
        if (checksum % 10 === 0) {
          return null;
        } else {
          return { invalidNumber: true };
        }
      }
    }
  }
}
