import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

@Component({
	selector: 'tr-checkbox',
	templateUrl: './checkbox.component.html',
	styleUrls: ['./checkbox.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class CheckboxComponent implements OnInit {

	constructor() { }

	@Input() condicion: boolean;
	@Input() checked: boolean;
	@Input() disabled: boolean;

	@Output() change: EventEmitter<boolean> = new EventEmitter<boolean>();

	ngOnInit() {
	}

	onChange(checked: boolean) {
		this.change.emit(checked);
	}

}
