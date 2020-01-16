import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation, ViewChild, AfterViewInit } from '@angular/core';
import * as dayjs from 'dayjs';
import 'dayjs/locale/es';
const localeObject = {
	//name: 'es_ar', weekdays: 'Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado'.split('_'), months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'), relativeTime: { future: 'en %s', past: 'hace %s', s: 'unos segundos', m: 'un minuto', mm: '%d minutos', h: 'una hora', hh: '%d horas', d: 'un día', dd: '%d días', M: 'un mes', MM: '%d meses', y: 'un año', yy: '%d años'},
	//monthsShort: 'ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic'.split('_')
	name: 'es_ar',
	weekdays: 'Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado'.split('_'),
	months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
	relativeTime: {
		future: 'en %s',
		past: 'hace %s',
		s: 'unos segundos',
		m: 'un minuto',
		mm: '%d minutos',
		h: 'una hora',
		hh: '%d horas',
		d: 'un día',
		dd: '%d días',
		M: 'un mes',
		MM: '%d meses',
		y: 'un año',
		yy: '%d años'
	},
	monthsShort: 'ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic'.split('_'),
	formats: {
	  LT: 'h:mm A',
	  LTS: 'h:mm:ss A',
	  L: 'MM/DD/YYYY',
	  LL: 'D [de] MMMM [de] YYYY',
	  LLL: 'D [de] MMMM [de] YYYY h:mm A',
	  LLLL: 'dddd, D [de] MMMM [de] YYYY h:mm A'
	}
};
dayjs.locale(localeObject);

@Component({
	selector: 'tr-selectormes',
	templateUrl: './selectormes.component.html',
	styleUrls: ['./selectormes.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class SelectormesComponent implements OnInit, AfterViewInit {

	constructor(
	) {	}

	@Output() change: EventEmitter<{ desde: string, hasta: string }> = new EventEmitter<{ desde: string, hasta: string }>();

	@Input() tipo: string;

	@Input() meses: number;

	@Input() offset: number;

	@Input() clase = 'toggleancho';

	periodos: any[] = [];

	hoy: dayjs.Dayjs = dayjs().set('date', 1);

	fecha: dayjs.Dayjs = dayjs().set('date', 1);

	seleccionado: {
		desde: dayjs.Dayjs,
		hasta: dayjs.Dayjs
	} = {
		desde: null,
		hasta: null
	};

	inicio = true;

	ngOnInit() {
		if (this.tipo !== 'periodo') {
			this.tipo = 'mes';
		}
		if (this.offset === undefined) {
			this.offset = 0;
		}
		this.fecha.add(this.offset, 'month');
		this.hoy.add(this.offset, 'month');
		if (this.meses === undefined) {
			this.meses = 4;
		}
		this.calcularPeriodos();
		this.inicio = false;
	}

	async ngAfterViewInit() {
		return;
	}

	calcularPeriodos(event?: MouseEvent, direccion?: string) {
		if (direccion) {
			if (direccion === 'despues') {
				if (event.ctrlKey) {
					this.fecha = this.hoy.clone();
				} else {
					this.fecha = this.fecha.add(1, 'month');
				}
			} else {
				if (event.ctrlKey) {
					this.fecha = this.fecha.subtract(this.meses, 'month');
				} else {
					this.fecha = this.fecha.subtract(1, 'month');
				}
			}
		} else {
			direccion = null;
		}
		this.periodos = [];
		let mes = this.fecha.clone().subtract(this.meses, 'month');
		for (let i = 0; i < this.meses; i++) {
			mes = mes.add(1, 'month');
			const periodo = {
				etiqueta: mes.format('MMM'),
				fecha: mes.clone(),
				seleccionado: false
			};
			if (this.tipo === 'mes') {
				periodo.seleccionado = mes.isSame(this.seleccionado.desde, 'month') || (this.inicio && mes.isSame(this.hoy, 'month'));
			} else {
				if (this.seleccionado.desde != null && this.seleccionado.hasta != null) {
					periodo.seleccionado = !periodo.fecha.isBefore(this.seleccionado.desde, 'month') && !periodo.fecha.isAfter(this.seleccionado.hasta, 'month');
				} else {
					periodo.seleccionado = periodo.fecha.isSame(this.seleccionado.desde, 'month') || periodo.fecha.isSame(this.seleccionado.hasta, 'month');
				}
			}
			if (i === 0 || periodo.etiqueta === 'Ene') {
				periodo.etiqueta += '/' + mes.format('YY');
			}
			this.periodos.push(periodo);
		}
		if (this.inicio && this.tipo === 'mes') {
			this.seleccionado.desde = this.hoy.clone();
			this.emitir();
		}
	}

	onSeleccionarMes(event, periodo) {
		event.preventDefault();
		const fecha = periodo.fecha;
		if (this.tipo === 'mes') {
			this.seleccionado.desde = fecha;
			this.emitir();
		} else {
			if (!this.seleccionado.desde && !this.seleccionado.hasta) {
				this.seleccionado.desde = fecha;
				this.seleccionado.hasta = fecha;
			} else if (fecha.isSame(this.seleccionado.desde, 'month') && fecha.isSame(this.seleccionado.hasta, 'month')) {
				this.seleccionado.desde = null;
				this.seleccionado.hasta = null;
			} else if (fecha.isSame(this.seleccionado.desde, 'month')) {
				if (this.seleccionado.hasta) {
					this.seleccionado.desde = this.seleccionado.hasta.clone();
				} else {
					this.seleccionado.desde = null;
				}
			} else if (fecha.isSame(this.seleccionado.hasta, 'month')) {
				this.seleccionado.hasta = this.seleccionado.desde.clone();
			} else {
				if (fecha.isAfter(this.seleccionado.hasta)) {
					this.seleccionado.hasta = fecha;
				} else if (fecha.isBefore(this.seleccionado.desde)) {
					this.seleccionado.desde = fecha;
				} else if (fecha.isAfter(this.seleccionado.desde) && fecha.isBefore(this.seleccionado.hasta)) {
					this.seleccionado.hasta = fecha;
				}
			}
			this.emitir();
		}
		this.calcularPeriodos();
	}

	emitir() {
		if (this.tipo === 'mes') {
			this.change.emit({ desde: this.seleccionado.desde.format('DD/MM/YYYY'), hasta: null });
		} else {
			this.change.emit({ desde: this.seleccionado.desde != null ? this.seleccionado.desde.format('DD/MM/YYYY') : null, hasta: this.seleccionado.hasta != null ? this.seleccionado.hasta.format(this.seleccionado.hasta.daysInMonth() + '/MM/YYYY') : null });
		}
	}

	setPeriodo(desde, hasta) {
		this.ngAfterViewInit().then(() => {
			if (this.tipo !== 'periodo') {
				return;
			}
			this.seleccionado.desde = desde;
			this.seleccionado.hasta = hasta;
			this.fecha = hasta;
			this.calcularPeriodos();
		});
	}

}
