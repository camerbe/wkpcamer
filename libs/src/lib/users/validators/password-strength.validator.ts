import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";


export function PasswordStrengthValidator(): ValidatorFn{
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null; // ne valide pas si le champ est vide (laisser Required gérer ça)
    }

    const hasUpperCase = /[A-Z]/.test(value);
    const hasDigit = /\d/.test(value);
    const hasSpecialChar = /[@$!%*?&^#()\-_=+[\]{};:'",.<>|/\\]/.test(value);
    const hasMinLength = value.length >= 8;

    const passwordValid = hasUpperCase && hasDigit && hasSpecialChar && hasMinLength;

    return !passwordValid ? { passwordStrength: true } : null;
  };
}
