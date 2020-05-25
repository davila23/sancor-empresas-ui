import { Component, OnInit, OnDestroy, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { MatTableDataSource, MatDialog, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS, MatDatepicker } from '@angular/material';
import { FormasDePagoService } from '@app/services/empresa/convenios/alta-wizard/componentes/formas-de-pago.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { UtilService } from '@app/core';
import { startWith, switchMap, map } from 'rxjs/operators';
import { BancoDTO } from '@app/models/banco.model';
import { FormaDePagoConvenioDTO, ExtensionCbuDTO } from '@app/models/forma-de-pago.model';
import { SimpleDTO } from '@app/models/simple.model';
import { CustomValidators } from '@tres-erres/ngx-utils';
import { EmpresaService } from '@app/services/empresa/empresa.service';
import { DetalleFormaPagoModalComponent } from '@app/shared/detalle-forma-pago-modal/detalle-forma-pago-modal.component';

// (1) Agregado para fecha vencimiento tarjeta mes/año
import { Moment } from 'moment';
import * as moment from 'moment';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
export const MY_FORMATS = {
	parse: {
		dateInput: 'MM/YYYY',
	},
	display: {
		dateInput: 'MM/YYYY',
		monthYearLabel: 'MMM YYYY',
		dateA11yLabel: 'LL',
		monthYearA11yLabel: 'MMMM YYYY',
	},
};
// Fin (1)

@Component({
	selector: 'detalle-formas-pago',
	templateUrl: './detalle-formas-pago.component.html',
	styleUrls: ['./detalle-formas-pago.component.scss'],
	// (2) Agregado para fecha vencimiento tarjeta mes/año
	providers: [
		{
			provide: DateAdapter,
			useClass: MomentDateAdapter,
			deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
		},

		{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
	]
	// Fin (2)
})
export class DetalleFormasPagoComponent implements OnInit {

	private _convenioId = new BehaviorSubject<number>(0);
	bancoCtrl = new FormControl();
	filteredBancos: Observable<any[]>;
	bancos: BancoDTO[];
	tarjetasList: SimpleDTO[];
	bancosList: SimpleDTO[];
	bancoTC: number;
	bancoCBU: number;
	formasDePagoList: FormaDePagoConvenioDTO[];
	cbu: number;
	cbuValido: boolean = true;
	mensajeError: string;
	dialogRef = null;
	cbuForm: FormGroup;
	tcForm: FormGroup;
	formaDePagoSelected: string;
	isEditionFlag = false;
	empresaIdFlag = null;
	convenioIdFlag = null;
	show: number;
	isPosting = false;
	lista: boolean = false;
	formasDePago: any = [];
	formaPagoDataSource = new MatTableDataSource<any>([]);
	forma_pago = new FormControl();
	tipo: string;

	list = [
		{ id: 1, descripcion: 'TC' },
		{ id: 2, descripcion: 'CBU' },
		{ id: 3, descripcion: 'EFECTIVO' },
	];

	tipoCuentaList: { id: string, descripcion: string }[] = [
		{ id: "", "descripcion": "-- Seleccionar --" },
		{ id: "CC", "descripcion": "Cuenta Corriente" },
		{ id: "CA", "descripcion": "Caja Ahorro" },
	];

	formaPago_displayedColumns = [
		'formaPago',
		'detalle'
	];

	@Input() set isEdition(isEdition) {
		setTimeout(() => {
			this.isEditionFlag = isEdition;
		});
	}

	@Input() set empresaId(empresaId) {
		setTimeout(() => {
			this.empresaIdFlag = empresaId;
		});
	}

	@Input() set convenioId(convenioId) {
		this._convenioId.next(convenioId);
		setTimeout(() => {
			this.convenioIdFlag = convenioId;
		});
	}

	constructor(private _fb: FormBuilder,
		private dialog: MatDialog,
		private formaPagoService: FormasDePagoService,
		private utilService: UtilService,
		private empresaService: EmpresaService) {

		this.bancos = JSON.parse(localStorage.getItem('bancos'));

		this.formaPagoService.getTiposFormasDePago('TC').subscribe(
			res => this.tarjetasList = res
		);

		this.formaPagoService.getTiposFormasDePago('CBU').subscribe(
			res => this.bancosList = res
		);

		this.cbuForm = this._fb.group({
			cuit: ['', [Validators.required, CustomValidators.cuit]],
			nrocbu: ['', [Validators.required, CustomValidators.cbu]],
			nroctabco: ['', [Validators.required, Validators.maxLength(16)]],
			tipoCuenta: ['', [Validators.required]],
			apellido: ['', [Validators.required, Validators.maxLength(50)]],
			nombre: ['', [Validators.required, Validators.maxLength(50)]]
		});

		this.tcForm = this._fb.group({
			vencimiento: [null, [Validators.required]],
			nrotarjeta: ['', [Validators.required]],
			bancoEmisor: ['', [Validators.required]]
		});
	}

	ngOnInit() {
		this._convenioId.subscribe(x => {
			this.formaPagoService.getFormasDePagoEmpresasD(x).subscribe(
				res => {
					if (res == null) {
						res = [];
					}
					console.log(res);
					this.formasDePagoList = res;
					this.formaPagoDataSource.data = res;
					if (res[0]) {
						this.formaDePagoSelected = res[0].descripcion;
					}
				}
			);
		});

		this.filteredBancos = this.bancoCtrl.valueChanges.pipe(
			startWith(''),
			map(banco => banco ? this.filterBancos(banco) : this.bancos.slice())
		);
	}

	getAllFormasDePago() {
		this._convenioId.subscribe(x => {
			this.formaPagoService.getFormasDePagoEmpresasD(x).subscribe(
				res => {
					if (res == null) {
						res = [];
					}
					this.formasDePagoList = res;
					this.formaPagoDataSource.data = res;
					if (res[0]) {
						this.formaDePagoSelected = res[0].descripcion;
					}
				}
			);
		});
	}

	filterBancos(name: string) {
		return this.bancos.filter(banco => banco.descripcion.toLowerCase().indexOf(name.toString().toLowerCase()) === 0);
	}

	onEnter(evt: any) {
		if (evt.source.selected) {
			this.bancoCtrl.setValue(evt.source.value.descripcion);
			this.bancoCBU = evt.source.value.id;
		}
	}

	focusOutFunction(e) {
		this.cbu = e.target.value;
		if (this.cbu) {
			this.empresaService.getEmpresaById(this.empresaIdFlag).subscribe(
				empresa => {
					let cuit = empresa[0].cuit;
					if (empresa[0]) {
						cuit = empresa[0].cuit;
					}
					this.formaPagoService.validarCBU(this.cbu, cuit).subscribe(
						fp => {
							console.log(fp);
							this.cbuValido = fp.data.CBUValido;
							this.mensajeError = fp.message;
						}
					);
				}
			);
		}
	}

	changeBancoTC(data) {
		this.bancoTC = data.value;
	}

	selectTipo(evt: any) {
		if (evt.source.selected) {
			this.show = evt.source.value;
		}
	}

	tcSaveRender() {
		this.isPosting = true;
		let formaDePagoConvenioDTO = new FormaDePagoConvenioDTO();
		formaDePagoConvenioDTO.fechaVencimiento = this.tcForm.value["vencimiento"];
		formaDePagoConvenioDTO.bancoEmisor = this.bancoTC;
		formaDePagoConvenioDTO.numeroTarjeta = this.tcForm.value["nrotarjeta"];
		formaDePagoConvenioDTO.tipoCuenta = 'E'; 
		formaDePagoConvenioDTO.cuentaNumero = this.convenioIdFlag; 
		formaDePagoConvenioDTO.codigoTarjeta = this.tcForm.value["codigotarjeta"];
		formaDePagoConvenioDTO.codSeguridad = 0; 
		formaDePagoConvenioDTO.numeroFormaPago = 0; 
		this.markControlsPristine(this.tcForm);
		console.log(formaDePagoConvenioDTO);
		this.formaPagoService.addFormaDePagoTarjetaD(formaDePagoConvenioDTO).subscribe(res => {
			let fp = new FormaDePagoConvenioDTO();
			fp.tipo = 'E';
			fp.descripcion = 'TC';
			fp.cuenta = this.convenioIdFlag;
			fp.numero = 1;
			this.formaPagoService.addFormasDePagoEmpresasD(fp).subscribe(res => {
				this.getAllFormasDePago();
			})
		}).add(() => {
			this.isPosting = false;
		});
	}

	cbuSaveRender() {
		let formaDePagoConvenioDTO = new FormaDePagoConvenioDTO();
		let cuit = this.cbuForm.value.cuit.replace(/-/gi, "");
		formaDePagoConvenioDTO.cuil = Number(cuit);
		formaDePagoConvenioDTO.nroCbu = this.cbuForm.value.nrocbu;
		formaDePagoConvenioDTO.banco = this.bancoCBU;
		formaDePagoConvenioDTO.numeroCuenta = this.cbuForm.value.nroctabco;
		formaDePagoConvenioDTO.apellido = this.cbuForm.value.apellido;
		formaDePagoConvenioDTO.nombre = this.cbuForm.value.nombre;
		formaDePagoConvenioDTO.numeroAfiliado = this.convenioIdFlag;
		formaDePagoConvenioDTO.tipoCuenta = 'E';
		formaDePagoConvenioDTO.formaPago = 1;
		formaDePagoConvenioDTO.tipoCuentaString = this.cbuForm.value.tipoCuenta;
		let extensionCBU = new ExtensionCbuDTO();
		extensionCBU.tipoCuenta = 'E'
		extensionCBU.numeroAfiliado = this.convenioIdFlag;
		extensionCBU.formaPago = 1;
		extensionCBU.alias = "";
		formaDePagoConvenioDTO.extension = extensionCBU;
		this.markControlsPristine(this.cbuForm);
		console.log(formaDePagoConvenioDTO);
		this.formaPagoService.addFormaDePagoCbuD(formaDePagoConvenioDTO).subscribe(res => {
			let fp = new FormaDePagoConvenioDTO();
			fp.tipo = 'E';
			fp.descripcion = 'CBU';
			fp.cuenta = this.convenioIdFlag;
			fp.numero = 1;
			this.formaPagoService.addFormasDePagoEmpresasD(fp).subscribe(res => {
				this.getAllFormasDePago();
			})
		}).add(() => {
			this.isPosting = false;
		});
		
	}

	efSaveRender() {
		let formaDePagoConvenioDTO = new FormaDePagoConvenioDTO();
		formaDePagoConvenioDTO.descripcion = 'EF';
		formaDePagoConvenioDTO.tipo = 'E';
		formaDePagoConvenioDTO.numero = 1;
		console.log(formaDePagoConvenioDTO);
	}

	postData(DTO) {
		this.isPosting = true;
		this.formaPagoService.addFormasDePagoEmpresasD(DTO)
			.subscribe(res => {
				this.utilService.notification('¡Forma de pago añadida con éxito!', 'success');
				this.getAllFormasDePago();
			}).add(() => {
				this.isPosting = false;
			});
	}

	checkFormaPago() {
		return (this.forma_pago.value == 'tc') ? 'tc' : 'cbu';
	}

	deleteFormaPagoModal(data) {
		if (this.dialogRef === null) {
			this.dialogRef = this.utilService.openConfirmDialog({
				titulo: '',
				texto: '¿Desea eliminar esta forma de pago?',
				confirmar: 'Eliminar',
				cancelar: 'Cancelar'
			});
			this.utilService.loseFocus();
			this.dialogRef.afterClosed().toPromise().then((respuesta) => {

				if (respuesta) {
					this.isPosting = true;
					let formaDePagoConvenioDTO = new FormaDePagoConvenioDTO();
					formaDePagoConvenioDTO.cuenta = this.convenioIdFlag;
					formaDePagoConvenioDTO.descripcion = data.descripcion;
					formaDePagoConvenioDTO.tipo = 'E';
					this.formaPagoService.deleteFormasDePagoEmpresasD(formaDePagoConvenioDTO)
						.subscribe(res => {
							this.formaPagoService.getFormasDePagoEmpresasD(this.convenioIdFlag)
								.subscribe(res => {
									if (res == null) res = [];
									this.formasDePagoList = res;
									this.formaPagoDataSource.data = res;
									this.markControlsPristine(this.tcForm);
									this.markControlsPristine(this.cbuForm);
								});
						}).add(() => {
							this.isPosting = false;
						});
				}
				this.dialogRef = null;
			});
		}
	}

	markControlsPristine(group: FormGroup | FormArray): void {
		Object.keys(group.controls).forEach((key: string) => {
			const abstractControl = group.controls[key];
			if (abstractControl instanceof FormGroup || abstractControl instanceof FormArray) {
				this.markControlsPristine(abstractControl);
			} else {
				abstractControl.markAsPristine();
			}
		});
	}

	openFormaPagoModal(data) {
		console.log(this.convenioIdFlag, data.descripcion);
		this.formaPagoService.getFormaDePagodetalle(this.convenioIdFlag, data.descripcion)
			.subscribe(res => {
				if (res) {
					let tipo = 'EF';
					if (data.descripcion.trim() == 'TC') tipo = 'TC';
					else if (data.descripcion.trim() == 'CBU') tipo = 'CBU';
					let parsedData = {
						tipo: tipo,
						datos: {
						}
					};
					switch (tipo) {
						case 'TC':
							parsedData.datos = {
								bancoId: res.bancoEmisor,
								descripcion: res.descripcion,
								numeroTarjeta: res.numeroTarjeta,
								fechaVencimiento: res.fechaVencimiento,
								bancoDesc: ''
							}
							break;
						case 'CBU':
							parsedData.datos = {
								nombre: res.nombre,
								apellido: res.apellido,
								descripcion: res.descripcion,
								cbu: res.nroCbu,
								cuenta: res.numeroCuenta,
								tipoCuenta: res.tipoCuentaString,
								bancoId: res.banco,
								bancoDesc: ''
							}
							break;
						case 'EF':
							parsedData.datos = {
								descripcion: 'EFECTIVO'
							}
							break;
					}
					const modal = this.dialog.open(DetalleFormaPagoModalComponent, {
						disableClose: true,
						panelClass: 'responsive-modal',
						data: parsedData
					});
				} else {
					this.dialogRef = this.utilService.openConfirmDialog({
						titulo: 'Error',
						texto: 'No se pudieron obtener los datos',
						confirmar: 'Aceptar',
						cancelar: ''
					});
					this.dialogRef.afterClosed().toPromise().then((respuesta) => { this.dialogRef = null });
				}
			});
	}

	// (3) Agregado para fecha vencimiento tarjeta mes/año
	chosenYearHandler(normalizedYear: Moment) {
		if (this.tcForm.controls['vencimiento'].value === null) {
			this.tcForm.controls['vencimiento'].setValue(moment());
		}
		const ctrlValue = this.tcForm.controls['vencimiento'].value;
		ctrlValue.year(normalizedYear.year());
		this.tcForm.controls['vencimiento'].setValue(ctrlValue);
	}

	chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
		if (this.tcForm.controls['vencimiento'].value === null) {
			this.tcForm.controls['vencimiento'].setValue(moment());
		}
		const ctrlValue = this.tcForm.controls['vencimiento'].value;
		ctrlValue.month(normalizedMonth.month());
		this.tcForm.controls['vencimiento'].setValue(ctrlValue);
		datepicker.close();
	}
	// Fin (3)
}