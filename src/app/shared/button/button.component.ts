import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatButton } from '@angular/material';

@Component({
	selector: 'app-button',
	templateUrl: './button.component.html',
	styleUrls: ['./button.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class ButtonComponent implements OnInit {

	constructor(
	) { }

	@Input() color = 'normal';
	@Input() disabled = false;
	@Input() name = 'button';

	@Output() clickBtn: EventEmitter<any> = new EventEmitter<any>();

	@ViewChild(MatButton) buttonElement: MatButton;

	ngOnInit() {
	}

	onClick(event) {
		this.clickBtn.emit(event);
	}

	focus() {
		this.buttonElement.focus();
	}

}
