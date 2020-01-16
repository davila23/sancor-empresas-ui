import { Component, OnInit, OnDestroy, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { FormasDePagoService } from '@app/services/empresa/convenios/alta-wizard/componentes/formas-de-pago.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { UtilService } from '@app/core';
import { DetalleFormaPagoModalComponent } from './detalle-forma-pago-modal/detalle-forma-pago-modal.component';
import { startWith, switchMap, map } from 'rxjs/operators';
import { BancoDTO } from '@app/models/banco.model';
import { FormaDePagoConvenioDTO } from '@app/models/forma-de-pago.model';
import { SimpleDTO } from '@app/models/simple.model';
import { CustomValidators } from '@tres-erres/ngx-utils';
import { EmpresaService } from '@app/services/empresa/empresa.service';

@Component({
	selector: 'detalle-formas-pago',
	templateUrl: './detalle-formas-pago.component.html',
	styleUrls: ['./detalle-formas-pago.component.scss']
})
export class DetalleFormasPagoComponent implements OnInit {

	private _convenioId = new BehaviorSubject<number>(0);
	bancoCtrl = new FormControl();
	filteredBancos: Observable<any[]>;
	bancos: BancoDTO[];
	tarjetasList: SimpleDTO[];
	bancosList: SimpleDTO[];
  bancoTC:number;
	bancoCBU:number;
	formasDePagoList:FormaDePagoConvenioDTO[];
	cbu:number;
	cbuValido:boolean = true;
	mensajeError:string;
	dialogRef = null;

	constructor(private _fb: FormBuilder,
		private dialog: MatDialog,
		private formaPagoService: FormasDePagoService,
		private utilService: UtilService,
		private empresaService: EmpresaService) {
		
		this.bancos = JSON.parse(localStorage.getItem('bancos'));

		this.formaPagoService.getTiposFormasDePago('TC').subscribe(
			res => this.tarjetasList = res
		)
		this.formaPagoService.getTiposFormasDePago('CBU').subscribe(
			res => this.bancosList = res
		)
	}

	@Input() set isEdition(isEdition) {
		setTimeout(() => {
			this.isEditionFlag = isEdition;
		});
	}

	formaDePagoSelected:string;

	ngOnInit(): void {
		
		this._convenioId.subscribe(x => {

			this.formaPagoService.getFormasDePagoEmpresasD(x).subscribe(
				res => {
			
					if(res==null){
						res = [];
					}
					this.formasDePagoList = res;
					this.formaPagoDataSource.data = res;
			
					if(res[0]){
					   this.formaDePagoSelected = res[0].descripcion;
				  }
				}
			)
		});

		this.filteredBancos = this.bancoCtrl.valueChanges.pipe(
			startWith(''),
			map(banco => banco ? this.filterBancos(banco) : this.bancos.slice())

		)

		this.formaPagoForm = this._fb.group({
			formaPago: ['', Validators.required],
			codigoTarjeta: [''],
			nrotarjeta: [''],
			vencimiento: [''],
			codSeguridad: [''],
			bancoEmisor: [''],
			nrocbu: ['', [Validators.required, CustomValidators.cbu]],
			tipoCuenta: ['', Validators.required],
			nroctabco: ['', Validators.required],
			apellido: ['', Validators.required],
			nombre: ['', Validators.required]
		})
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

	focusOutFunction(e){
		
		this.cbu = e.target.value;
		if(this.cbu){
			
			this.empresaService.getEmpresaById(this.empresaIdFlag).subscribe(
				empresa => {
					let cuit = empresa[0].cuit;
					if(empresa[0]){
						cuit = empresa[0].cuit;
					}
					
					this.formaPagoService.validarCBU(this.cbu,cuit).subscribe(
						fp => {
							console.log(fp);
							this.cbuValido = fp.data.CBUValido;
							this.mensajeError = fp.message;
						}
					)
				}
			)
		}
	}


	changeTipoCuenta(data) {
		console.log(data.value);
	}

	changeBancoTC(data){
		console.log(data.value);
		this.bancoTC = data.value;
	}


	@Input() set empresaId(empresaId) {
		setTimeout(() => {
			this.empresaIdFlag = empresaId;
		});
	}

	isEditionFlag = false;
	empresaIdFlag = null;
	convenioIdFlag = null;
	formaPagoForm: FormGroup;
	show: number;
  isPosting = false;

	selectTipo(evt: any) {

		if (evt.source.selected) {
			this.show = evt.source.value;
		
		}
	}
	
	lista:boolean = false;

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

	formasDePago: any = [];

	formaPagoDataSource = new MatTableDataSource<any>([]);

	formaPagoDataSourceSaveAndRender() {


		if(!this.cbuValido){
			return;
		}

    this.isPosting = true;

		let formaDePagoConvenioDTO = new FormaDePagoConvenioDTO();

		if (this.show == 1) {
			
			formaDePagoConvenioDTO.codigoTarjeta = this.formaPagoForm.value["codigotarjeta"];
			formaDePagoConvenioDTO.numeroTarjeta = this.formaPagoForm.value["nrotarjeta"];
			formaDePagoConvenioDTO.fechaVencimiento = this.formaPagoForm.value["codigotarjeta"];
			formaDePagoConvenioDTO.idConvenio = this.convenioIdFlag;
			formaDePagoConvenioDTO.bancoEmisor = this.bancoTC;
			formaDePagoConvenioDTO.descripcion = 'TC';

				
		} else if (this.show == 2) {
			
			formaDePagoConvenioDTO.descripcion = 'CBU';
		  formaDePagoConvenioDTO.tipoCuentaString = this.formaPagoForm.value.tipoCuenta;
			formaDePagoConvenioDTO.nroCbu = this.formaPagoForm.value.nrocbu;
			formaDePagoConvenioDTO.banco = this.bancoCBU;
			formaDePagoConvenioDTO.numeroCuenta = this.formaPagoForm.value.nroctabco;
			formaDePagoConvenioDTO.apellido = this.formaPagoForm.value.apellido;
			formaDePagoConvenioDTO.nombre = this.formaPagoForm.value.nombre;
			formaDePagoConvenioDTO.idConvenio = this.convenioIdFlag;
			this.markControlsPristine(this.formaPagoForm);
		
		} else if (this.show == 3) {
			formaDePagoConvenioDTO.descripcion = 'EF';
			formaDePagoConvenioDTO.idConvenio = this.convenioIdFlag;
		}

	
    this.formaPagoService.addFormasDePagoEmpresasD(formaDePagoConvenioDTO)
    .subscribe(res =>{
      this.formaPagoService.getFormasDePagoEmpresasD(this.convenioIdFlag)
      .subscribe(res => {
        if (res == null) res = [];
          
        
        this.formasDePagoList = res;
        this.formaPagoDataSource.data = res;
      });
    }).add(() => {
      this.isPosting = false;
    });
	
		//this.formaPagoForm.reset({ formaPago: '' });
	}

	@Input() set convenioId(convenioId) {
		this._convenioId.next(convenioId);
		setTimeout(() => {		
      this.convenioIdFlag = convenioId;
		});
	}
	forma_pago = new FormControl();
	checkFormaPago() {
		return (this.forma_pago.value == 'tc') ? 'tc' : 'cbu';
	}

	tipo :string;

	deleteFormaPagoModal(data){
  
    if (this.dialogRef === null) {
			this.dialogRef = this.utilService.openConfirmDialog({
				titulo: 'Dialogo de confirmación',
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
          formaDePagoConvenioDTO.formaDePago = data.descripcion;

          this.formaPagoService.deleteFormasDePagoEmpresasD(formaDePagoConvenioDTO)
          .subscribe(res => {
            this.formaPagoService.getFormasDePagoEmpresasD(this.convenioIdFlag)
            .subscribe(res => {
              if (res == null) res = [];
              
              
              this.formasDePagoList = res;
              this.formaPagoDataSource.data = res;
              //this.formaPagoForm.reset();
              this.markControlsPristine(this.formaPagoForm);  
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
	
		this.formaPagoService.getFormaDePagodetalleD(this.convenioIdFlag,data.descripcion).subscribe(
			res=>{
        let dataFields = {};
		
				if(data.descripcion.trim() ==='TC'){
					this.tipo = 'tc';
					dataFields={tc:res};
				}else{
					this.tipo = 'cbu';
				  dataFields= {cbu:res};
				}

				const modal = this.dialog.open(DetalleFormaPagoModalComponent, {
					disableClose: true,
					panelClass: 'responsive-modal',
					data: {
						type: this.tipo,
						dataFields
						/*: {
							x*/
							/*
							tc: {
								codigoTarjeta: '992',
								numeroTarjeta: '4849 5819 2483 8839',
								vencimiento: '12/22'
							},
							cbu: {
								codigoEnvio: 'XF1AKX34000',
								cbu: '0170231820000000010500',
								banco: 'Banco Francés',
								tipoCuenta: 'Propia',
								nroCuenta: '4136',
								apellido: 'Montaner',
								nombre: 'Ricardo',
								cuit: '30-12345678-9'
							}*/
						/*}*/
					}
				});
			}
		)
	}
}