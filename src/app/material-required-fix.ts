import { MatInput, MatSelect, MatAutocomplete } from '@angular/material';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

/**
 * Fix for the Material Reactive Form required asterisk.
 */

const funcs = {
    get(): boolean {
        if (this._required) {
            return this._required;
        }

        // The required attribute is set
        // when the control return an error from validation with an empty value
        if (this.ngControl && this.ngControl.control && this.ngControl.control.validator) {
            const emptyValueControl = Object.assign({}, this.ngControl.control);
            (emptyValueControl as any).value = null;
            return 'required' in (this.ngControl.control.validator(emptyValueControl) || {});
        }
        return false;
    },
    set(value: boolean) {
        this._required = coerceBooleanProperty(value);
    }
};

Object.defineProperty(MatInput.prototype, 'required', funcs);
Object.defineProperty(MatSelect.prototype, 'required', funcs);
Object.defineProperty(MatAutocomplete.prototype, 'required', funcs);