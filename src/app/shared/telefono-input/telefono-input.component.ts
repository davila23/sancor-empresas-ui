import { Component, OnDestroy, Input, ElementRef, OnInit, HostListener, Self, Optional, DoCheck } from '@angular/core';
import { MatFormFieldControl } from '@angular/material';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { FormGroup, Validators, NgControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { FocusMonitor } from '@angular/cdk/a11y';

/** Data structure for holding telephone number. */
export class Telefono {
    constructor(public caracteristica: string, public numero: string) {}
}

@Component({
    selector: 'telefono-input',
    templateUrl: './telefono-input.component.html',
    styleUrls: ['./telefono-input.component.scss'],
    providers: [{ provide: MatFormFieldControl, useExisting: TelefonoInputComponent }],
    host: {
        '[class.floating]': 'shouldLabelFloat',
        '[id]': 'id',
        '[attr.aria-describedby]': 'describedBy'
    }
})
export class TelefonoInputComponent implements MatFormFieldControl<Telefono>, OnDestroy, OnInit, DoCheck {
    static nextId = 0;

    @Input() form: FormGroup;
    @Input() name: string;
    @Input() readonly;
    stateChanges = new Subject<void>();
    focused = false;
    // ngControl = null;
    errorState = false;
    controlType = 'tel-input';
    id = `tel-input-${TelefonoInputComponent.nextId++}`;
    describedBy = '';

    status = {
        numero: 'VALID',
        caracteristica: 'VALID'
    };

    private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', '-', 'ArrowLeft', 'ArrowRight'];

    get empty() {
        const { value: { caracteristica, numero } } = this.form;

        return !caracteristica && !numero;
    }

    get shouldLabelFloat() {
        return this.focused || !this.empty;
    }

    @Input()
    get placeholder(): string {
        return this._placeholder;
    }
    set placeholder(value: string) {
        this._placeholder = value;
        this.stateChanges.next();
    }
    private _placeholder: string;

    @Input()
    get required(): boolean {
        return this._required;
    }
    set required(value: boolean) {
        this._required = coerceBooleanProperty(value);
        this.stateChanges.next();
    }
    private _required = false;

    @Input()
    get disabled(): boolean {
        return this._disabled;
    }
    set disabled(value: boolean) {
        this._disabled = coerceBooleanProperty(value);
        this._disabled ? this.form.disable() : this.form.enable();
        this.stateChanges.next();
    }
    private _disabled = false;

    @Input()
    get value(): Telefono | null {
        const { value: { caracteristica, numero } } = this.form;
        if (caracteristica.length === 3 && numero.length === 4) {
            return new Telefono(caracteristica, numero);
        }
        return null;
    }
    set value(tel: Telefono | null) {
        const { caracteristica, numero } = tel || new Telefono('', '');
        this.form.setValue({ caracteristica, numero });
        this.stateChanges.next();
    }

    constructor(
        private fm: FocusMonitor,
        private elRef: ElementRef<HTMLElement>,
        @Optional()
        @Self()
        public ngControl: NgControl
    ) {
        fm.monitor(elRef.nativeElement, true).subscribe(origin => {
            this.focused = !!origin;
            this.stateChanges.next();
        });
    }

    ngOnInit() {

        const keys = ['caracteristica', 'numero'];

        
        keys.forEach(field => {
            (this.required) ? this.form.controls[field].setValidators(Validators.required) : this.form.get(field).clearValidators();
            if(!this.required) {
                this.form.valueChanges.subscribe(r => {
                    if (field === 'caracteristica') {
                        if (this.form.get(field).value && !this.form.get('numero').value) {
                            this.form.controls['numero'].setValidators(Validators.required);
                        } else {
                            this.form.controls['numero'].clearValidators();
                        }
                    } else {
                        if (this.form.get(field).value && !this.form.get('caracteristica').value) {
                            this.form.controls['caracteristica'].setValidators(Validators.required)
                        } else {
                            this.form.controls['caracteristica'].clearValidators();
                        }
                    }
                    this.form.get(field).updateValueAndValidity({emitEvent: false});
                });
            }
            this.form.get(field).updateValueAndValidity();
        });
    }

    ngDoCheck() {
        let isValid = true;
        ['caracteristica', 'numero'].forEach(field => {
            isValid = isValid && this.form.get(field).valid;
        })
        this.errorState = !isValid && (this.form.dirty || this.form.touched) && !this.readonly;
    }

    ngOnDestroy() {
        this.stateChanges.complete();
        this.fm.stopMonitoring(this.elRef.nativeElement);
    }

    setDescribedByIds(ids: string[]) {
        this.describedBy = ids.join(' ');
    }

    onContainerClick(event: MouseEvent) {
        if ((event.target as Element).tagName.toLowerCase() !== 'input') {
            this.elRef.nativeElement.querySelector('input')!.focus();
        }
        this.errorState = this.status.caracteristica === 'INVALID' || this.status.numero === 'INVALID';
    }

    focus() {
        this.elRef.nativeElement.querySelector('input')!.focus();
    }

    onKeyDown(ev: any, numero: number) {
        if (ev.keyCode === 9 || ev.keyCode === 13) {
            if (numero === 1 && !ev.shiftKey) {
                this.elRef.nativeElement.querySelectorAll('input')![1].focus();
                ev.preventDefault();
                ev.stopPropagation();
            } else if (numero === 2 && ev.shiftKey) {
                this.elRef.nativeElement.querySelectorAll('input')![0].focus();
                ev.preventDefault();
                ev.stopPropagation();
            }
        }

        const esNumero = String(ev.key).match(new RegExp(/^[0-9]+$/g));
        const current = ev.target.value.concat(ev.key);

        const seleccionado = ev.target.selectionStart === 0 && ev.target.selectionEnd === current.length && current.length > 0;
        if (seleccionado && esNumero) {
            ev.target.value = ev.key;
            ev.preventDefault();
            return;
        }

        if (numero === 1 && esNumero && current.length > 5) {
            ev.preventDefault();
            ev.stopPropagation();
        } else if (numero === 2 && esNumero && current.length > 8) {
            ev.preventDefault();
            ev.stopPropagation();
        } else if (!esNumero && this.specialKeys.indexOf(ev.key) === -1) {
            ev.preventDefault();
            ev.stopPropagation();
        }
    }

}
