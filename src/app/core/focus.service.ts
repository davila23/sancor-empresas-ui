import { Injectable, QueryList, EventEmitter } from '@angular/core';
import { FocusNextDirective } from '@app/shared';

@Injectable()
export class FocusService {

	constructor() { }

	onFocusNext: EventEmitter<any> = new EventEmitter<any>();
	focusShift = false;

	/**
	 * Función que busca al siguiente elemento focusable siguiendo una lista
	 * ordenada anteriormente por tabindex
	 *
	 * NOTA: tabIndex == 0 no es focusable
	 * Utilizar en casos en los que es condicional que sea focusable.
	 * Por ej:
	 * <input ... [trFocusNext]="focusable ? X : 0">
	 *
	 * @param currentIndex tabIndex actual, desde donde se emitió el evento
	 * @param focusElements QueryList de objetos que apliquen la directiva FocusNext
	 */
	nextFocus(currentIndex, focusElements: QueryList<FocusNextDirective>) {
		if (!focusElements) {
			console.error('No está declarada la QueryList de "focusElements" en el componente o hay un error en la misma.');
			return;
		} else if (focusElements.length === 0) {
			console.error('No existen elementos con directiva trFocusNext aplicada.');
			return;
		}
		currentIndex = Number.parseInt(currentIndex, 10);
		let found = false;
		let shift = false;
		if (currentIndex < 0) {
			shift = true;
			currentIndex = currentIndex * -1;
		}
		const tabis = focusElements.map((item) => item.tabIndex);
		const max = Math.max(...tabis);
		const min = Math.min(...tabis);
		for (let i = currentIndex + (shift ? -1 : 1); shift ? (i >= min) : (i <= max); shift ? i-- : i++) {
			focusElements.forEach((focusElement) => {
				// Dejo pasar !focusElement.host para que tire el console.error
				if (i == focusElement.tabIndex && i > 0 && (!focusElement.host || (focusElement.host.disabled !== true && focusElement.host.readonly !== true))) {
					focusElement.shift = shift;
					focusElement.focus();
					found = true;
				}
			});
			if (found) { break; }
		}
		const cond = (shift ? (max * -1) : min);
		if (!currentIndex && !found && currentIndex === cond) {
			return;
		} else if (!found) {
			this.nextFocus(cond - 1, focusElements);
		}
	}

}
