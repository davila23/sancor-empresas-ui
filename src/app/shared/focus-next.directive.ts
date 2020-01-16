import { Directive, ViewContainerRef, HostListener, Input, Host, Self, Optional, AfterViewInit } from '@angular/core';
import { MatInput, MatButton, MatCheckbox, MatRadioButton, MatSelect, MatExpansionPanel } from '@angular/material';
import { FocusService } from '@app/core';
import { AutocompleteComponent, FechaComponent } from '@componentes/.';
import { NgControl } from '@angular/forms';
import { ButtonComponent } from './button/button.component';

@Directive({
	selector: '[appFocusNext]'
})
export class FocusNextDirective implements AfterViewInit {

	constructor(
		private _view: ViewContainerRef,
		private focusService: FocusService,
		@Host() @Self() @Optional() public hostInput: MatInput,
		@Host() @Self() @Optional() public hostAutocomplete: AutocompleteComponent,
		@Host() @Self() @Optional() public hostButton: MatButton,
		@Host() @Self() @Optional() public hostAppButton: ButtonComponent,
		@Host() @Self() @Optional() public hostCheckbox: MatCheckbox,
		@Host() @Self() @Optional() public hostRadio: MatRadioButton,
		@Host() @Self() @Optional() public hostFecha: FechaComponent,
		@Host() @Self() @Optional() public hostSelect: MatSelect,
		@Host() @Self() @Optional() public hostExpPanel: MatExpansionPanel
	) { }

	/**
	 * Componente padre de donde sacar el listado de focusElements
	 * Todos deben llevar esto para que funcione:
	 * @ViewChildren(FocusNextDirective) focusElements: QueryList<FocusNextDirective>;
	 */
	component: any;

	/**
	 * Identificable para focusear específico
	 */
	name: string;

	/**
	 * Componente donde está la directiva
	 */
	host: any;

	/**
	 * Booleano que indica si fue presionado el shift
	 * Tomar en cuanta que tabIndex pasa negativo para esto
	 */
	shift = false;

	/**
	 * Si el evento fue generado por el usuario
	 * Si se hace un focus programático, establecer primero en false
	 */
	isTrusted = true;

	/**
	 * Simil tabindex nativo
	 * <input trFocusNext="2">
	 */
	@Input('appFocusNext') tabIndex: number;

	ngAfterViewInit() {
		this.tabIndex = Number.parseInt('' + this.tabIndex, 10);
		this.component = this._view['_view'].component;
		this.host = this.hostAutocomplete || this.hostInput || this.hostButton || this.hostAppButton || this.hostCheckbox || this.hostRadio || this.hostFecha || this.hostSelect || this.hostExpPanel;
		if (!this.host) {
			console.error('No se encontró componente host', this);
			return;
		} else if (!this.host.name) {
			if (this.host instanceof MatExpansionPanel) {
				const attr: NamedNodeMap = this.host['_viewContainerRef'].element.nativeElement.attributes;
				if (attr.getNamedItem('name') && attr.getNamedItem('name').value.length > 0) {
					this.host['name'] = attr.getNamedItem('name').value;
				}
			} else if (this.host instanceof MatSelect) {
				const ngcontrol: NgControl = this.host.ngControl;
				this.name = ngcontrol.name;
			} else if (this.host._elementRef && this.host._elementRef.nativeElement.name) {
				this.host.name = this.host._elementRef.nativeElement.name;
			}
		}
		if (!this.host.name && !this.name && !(this.host instanceof MatButton)) {
			console.error('No está definido "name" para este componente', this.host);
		} else if (!this.name) {
			this.name = this.host.name;
		}
	}

	focus() {
		if (!this.host) {
			console.error('No se encontró componente host');
		} else if (typeof this.host.focus !== 'function' && !(this.host instanceof MatExpansionPanel)) {
			console.error('No hay función "focus" definida para ' + this.host.constructor.name);
		} else {
			if (this.host instanceof MatExpansionPanel) {
				this.host.open();
				setTimeout(() => {
					let tabIndex = this.tabIndex;
					if (this.focusService.focusShift) {
						tabIndex = tabIndex * -1;
					}
					this.focusService.nextFocus(tabIndex, this.component.focusElements);
				}, 200);
			} else {
				this.host.focus();
			}
			if (this.host instanceof MatSelect) {
				this.host.open();
			}
			if (this.isTrusted) {
				this.focusService.onFocusNext.emit(this.tabIndex * (this.shift ? -1 : 1));
			}
			if (this.shift) { this.shift = false; }
			if (!this.isTrusted) { this.isTrusted = true; }
		}
	}

	private isKey(event, comparation) {
		return event.key === comparation ||
			event.keyIdentifier === comparation ||
			event.keyCode === comparation;
	}

	@HostListener('keydown', ['$event'])
	onKeyDown(event: KeyboardEvent) {
		if (this.isKey(event, 13) || this.isKey(event, 9)) {
			event.preventDefault();
			let tabIndex: number = this.tabIndex;
			// Si presiona shift, vuelvo para atrás
			if (event.shiftKey) {
				tabIndex = tabIndex * -1;
			}
			this.focusService.focusShift = event.shiftKey;
			this.focusService.nextFocus(tabIndex, this.component.focusElements);
			event.stopPropagation();
		}
	}

	@HostListener('focus', ['$event'])
	onFocus(event) {
		if (event.target.select) {
			event.target.select();
		}
	}

}
