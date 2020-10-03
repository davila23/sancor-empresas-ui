import { ValidatorFn, AbstractControl, ValidationErrors, FormGroup } from '@angular/forms';
import { validarCBU, validarCUIT } from './validation';

function isEmptyInputValue(value: any): boolean {
    // we don't check for string here so it also works with arrays
    return value == null || value.length === 0;
}

// @dynamic
export class CustomValidators {
    /**
     * cbu: CBU inválido
     * cbuLength: El largo debe ser de 22 caracteres
     */
    static cbu(control: AbstractControl): ValidationErrors | null {
        if (isEmptyInputValue(control.value)) {
            return null; // don't validate empty values to allow optional controls
        }

        const value = control.value;
        const error = {};
        const res = validarCBU(value);

        if (typeof res === 'string') {
            error[res] = true;
        }

        return !isNaN(value) && Object.keys(error).length === 1 ? error : null;
    }

    /**
     * cuit: CUIT inválido
     * cuitLength: El largo debe ser de 13 caracteres
     */
    static cuit(control: AbstractControl): ValidationErrors | null {
        if (isEmptyInputValue(control.value)) {
            return null; // don't validate empty values to allow optional controls
        }

        const value = control.value;
        const error = {};
        const res = validarCUIT(value);

        if (typeof res === 'string') {
            error[res] = true;
        }

        return Object.keys(error).length === 1 ? error : null;
    }

    static telefono(group: FormGroup): ValidationErrors | null {
        const error: any = {};

        for (const key in group.controls) {
            if (group.controls.hasOwnProperty(key)) {
                if (group.controls[key].errors) {
                    group.controls[key].errors['telefono'] = true;
                    error.telefono = true;
                }
            }
        }

        return Object.keys(error).length === 1 ? error : null;
    }

    static requiredIf(requiredIf: () => boolean): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;
            if ((value == null || value === undefined || value === '') && requiredIf()) {
                return {
                    required: { condition: requiredIf() }
                };
            }
            return null;
        };
    }
}
