import { Component, OnInit, Input } from '@angular/core';
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
	selector: 'app-formas-pago',
	templateUrl: './formas-pago.component.html',
	styleUrls: ['./formas-pago.component.scss']
})
export class FormasPagoComponent implements OnInit {

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
  formaDePagoSelected:string;

	constructor(private _fb: FormBuilder,
		private dialog: MatDialog,
		private formaPagoService: FormasDePagoService,
		private utilService: UtilService,
		private empresaService: EmpresaService) {
		
		this.bancos = JSON.parse(localStorage.getItem('bancos'));

    this.formaPagoService.getTiposFormasDePago('TC')
    .subscribe(res => this.tarjetasList = res);

    this.formaPagoService.getTiposFormasDePago('CBU')
    .subscribe(res => this.bancosList = res);
    
    this.cbuForm = this._fb.group({
      cuit: ['', [Validators.required, CustomValidators.cuit]],
      nrocbu: ['', [Validators.required, CustomValidators.cbu]],
      nroctabco: ['', [Validators.required, Validators.maxLength(16)]],
      tipoCuenta: ['', [Validators.required]],
      apellido: ['', [Validators.required, Validators.maxLength(50)]],
      nombre: ['', [Validators.required, Validators.maxLength(50)]]
    });

    this.tcForm = this._fb.group({
      vencimiento: ['', [Validators.required]],
      nrotarjeta: ['', [Validators.required]],
      bancoEmisor: ['', [Validators.required]]
    });
	}

  cbuForm: FormGroup;
  tcForm: FormGroup;

	@Input() set isEdition(isEdition) {
		setTimeout(() => {
			this.isEditionFlag = isEdition;
		});
	}

  @Input() set isAllowedToEdit(boolean) {
    setTimeout( () => {
      this.edit = boolean;
    });
  } edit = false;

  @Input() set isAllowedToDelete(boolean) {
    setTimeout(() => {
      this.delete = boolean;
    });
  } delete = false;

  @Input() set convenioId(convenioId) {
		setTimeout(() => {
      this.convenioIdFlag = convenioId;
      this.fillFormaDePago();
		});
	}

	@Input() set empresaId(empresaId) {
		setTimeout(() => {
			this.empresaIdFlag = empresaId;
		});
	}

	ngOnInit(): void {
    this.filteredBancos = this.bancoCtrl.valueChanges
    .pipe(startWith(''), map(banco => banco ? this.filterBancos(banco) : this.bancos.slice()));
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

	focusOutFunction(){
    if (this.cbuForm.get('nrocbu').value != '' && this.cbuForm.get('cuit').value != '') {
      this.formaPagoService.validarCBU(
        this.cbuForm.get('nrocbu').value, 
        this.cbuForm.get('cuit').value)
      .subscribe(fp => {
        this.cbuValido = fp.data.CBUValido;
        this.mensajeError = fp.message;
      });
    }
	}

	changeBancoTC(data) {
		this.bancoTC = data.value;
  }


	isEditionFlag = false;
	empresaIdFlag = null;
	convenioIdFlag = null;
	formaPagoForm: FormGroup;
	show: number;
  isPosting = false;

	selectTipo(evt: any) {
		if (evt.source.selected) this.show = evt.source.value;
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

  cbuSaveRender() {
    let formaDePagoConvenioDTO = new FormaDePagoConvenioDTO();

    formaDePagoConvenioDTO.descripcion = 'CBU';
    formaDePagoConvenioDTO.tipoCuentaString = this.cbuForm.value.tipoCuenta;
    formaDePagoConvenioDTO.nroCbu = this.cbuForm.value.nrocbu;
    formaDePagoConvenioDTO.banco = this.bancoCBU;
    formaDePagoConvenioDTO.numeroCuenta = this.cbuForm.value.nroctabco;
    formaDePagoConvenioDTO.apellido = this.cbuForm.value.apellido;
    formaDePagoConvenioDTO.nombre = this.cbuForm.value.nombre;
    formaDePagoConvenioDTO.idConvenio = this.convenioIdFlag;
    this.markControlsPristine(this.cbuForm);

    this.postData(formaDePagoConvenioDTO);
  }

  tcSaveRender() {
    let formaDePagoConvenioDTO = new FormaDePagoConvenioDTO();

    formaDePagoConvenioDTO.codigoTarjeta = this.tcForm.value["codigotarjeta"];
    formaDePagoConvenioDTO.numeroTarjeta = this.tcForm.value["nrotarjeta"];
    formaDePagoConvenioDTO.fechaVencimiento = this.tcForm.value["codigotarjeta"];
    formaDePagoConvenioDTO.idConvenio = this.convenioIdFlag;
    formaDePagoConvenioDTO.bancoEmisor = this.bancoTC;
    formaDePagoConvenioDTO.descripcion = 'TC';

    this.postData(formaDePagoConvenioDTO);
  }

  efSaveRender() {
    let formaDePagoConvenioDTO = new FormaDePagoConvenioDTO();

    formaDePagoConvenioDTO.descripcion = 'EF';
    formaDePagoConvenioDTO.idConvenio = this.convenioIdFlag;

    this.postData(formaDePagoConvenioDTO);
  }

  postData(DTO) {
    this.isPosting = true;

    this.formaPagoService.addFormasDePagoEmpresas(DTO)
    .subscribe(res =>{

      this.utilService.notification('¡Forma de pago añadida con éxito!', 'success');

      this.fillFormaDePago();
    }).add(() => {
      this.isPosting = false;
    });
  } 

	fillFormaDePago() {
    this.isPosting = true;
    this.formaPagoService.getFormasDePagoEmpresas(this.convenioIdFlag)
    .subscribe(res => {
      if (res == null) res = [];
        
      
      this.formasDePagoList = res;
      this.formaPagoDataSource.data = res;
    }).add(() => {
      this.isPosting = false;
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

          this.formaPagoService.deleteFormasDePagoEmpresas(formaDePagoConvenioDTO)
          .subscribe(res => {
            this.utilService.notification('¡Forma de pago eliminada con éxito!', 'success');
            this.fillFormaDePago();
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
	
    this.formaPagoService.getFormaDePagodetalle(this.convenioIdFlag,data.descripcion)
    .subscribe(res=> {

      console.log('data', data);
      console.log('res', res);

      let tipo = 'EF';

      if (data.descripcion.trim() == 'TC') tipo = 'TC';  
      else if (data.descripcion.trim() == 'CBU') tipo = 'CBU';
      
      let parsedData = {
        tipo: tipo,
        datos: {
          
        }
      };

      switch(tipo) {
        case 'TC':
          parsedData.datos = {
            bancoId: res.bancoEmisor,
            descripcion: res.descripcion,
            numeroTarjeta: res.numeroTarjeta,
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

      console.log(this.tarjetasList);

      const modal = this.dialog.open(DetalleFormaPagoModalComponent, {
        disableClose: true,
        panelClass: 'responsive-modal',
        data: parsedData
      });
    });
	}

}