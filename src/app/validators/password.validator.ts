import { FormGroup, FormControl, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export interface ValidationResult {
  [key: string]: boolean;
}

export class PasswordValidator {
  public static checkPasswordEquality(group: FormGroup): { [s: string]: boolean } {
    return group.get('pwd').value !== group.get('confirm').value ? { passwordsDoNotMatch: true } : null;
  }

  public static checkPasswordStrength(password: FormControl): any {
    const validations = {
      hasNumber: /\d/.test(password.value),
      hasUpper: /[A-Z]/.test(password.value),
      hasLower: /[a-z]/.test(password.value),
      hasEightCharacters: /^.{8,}/.test(password.value),
      hasSpecialCharacter: /[!@#$%^&*(),.?":{}|<>]/.test(password.value)
    };
    const errors = Object.keys(validations).find(key => {
      return !validations[key];
    });
    return errors ? { patternDoesNotMatch: true } : null;
  }
  static LookEmptyness(AC: AbstractControl) {
    const email = String(AC.get('email').value); // to get value in input tag
    const phone = String(AC.get('phone').value); // to get value in input tag
    if (email.length === 0 && phone.length === 0) {
      AC.get('email').setErrors({ MatchPassword: true });
    } else {
      return null;
    }
  }

  static patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        // if control is empty return no error
        return null;
      }
      // test the value of the control against the regexp supplied
      const valid = regex.test(control.value);
      // if true, return no error (no error), else return error passed in the second parameter
      return valid ? null : error;
    };
  }

  static checkLimit(min: number, max: number): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
      if (
        c.value &&
        (isNaN(c.value) || String(c.value).length < min || String(c.value).length > max || isNaN(Number(c.value)) || c.value < 0)
      ) {
        if (isNaN(Number(c.value)) || c.value < 0) {
          return { symbols: true };
        }
        return { range: true };
      }
      return null;
    };
  }
}
