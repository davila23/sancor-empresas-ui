import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { MatTableDataSource, MatDialog, MatDatepicker, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { FormasDePagoService } from '@app/services/empresa/convenios/alta-wizard/componentes/formas-de-pago.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { UtilService } from '@app/core';
import { startWith, switchMap, map } from 'rxjs/operators';
import { BancoDTO } from '@app/models/banco.model';
import { FormaDePagoConvenioDTO } from '@app/models/forma-de-pago.model';
import { SimpleDTO } from '@app/models/simple.model';
import { CustomValidators } from '@tres-erres/ngx-utils';
import { EmpresaService } from '@app/services/empresa/empresa.service';
import { DetalleFormaPagoModalComponent } from '@app/shared/detalle-forma-pago-modal/detalle-forma-pago-modal.component';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';

// (1) Agregado para fecha vencimiento tarjeta mes/año
import { Moment } from 'moment';
import * as moment from 'moment';
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
  selector: 'app-formas-pago',
  templateUrl: './formas-pago.component.html',
  styleUrls: ['./formas-pago.component.scss'],
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
export class FormasPagoComponent implements OnInit {

  private _convenioId = new BehaviorSubject<number>(0);
  bancoCtrl = new FormControl('', Validators.required);
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
  formaDePagoSelected: string;
  cbuForm: FormGroup;
  tcForm: FormGroup;

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

  @Input() set isEdition(isEdition) {
    setTimeout(() => {
      this.isEditionFlag = isEdition;
    });
  }

  @Input() set isAllowedToEdit(boolean) {
    setTimeout(() => {
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
    return this.bancos.filter(banco => banco.descripcion.toLowerCase().includes(name.toString().toLowerCase()));
  }

  onEnter(evt: any) {
    if (evt.source.selected) {
      this.bancoCtrl.setValue(evt.source.value.descripcion);
      this.bancoCBU = evt.source.value.id;
    }
  }

  focusOutFunction() {
    if (this.cbuForm.get('nrocbu').value != '' &&
      this.cbuForm.get('cuit').value != '') {
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
    if (evt.source.selected) {
      this.show = evt.source.value;
      this.cbuValido = true;
    }
  }

  lista: boolean = false;

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
    if (this.cbuForm.invalid) {
      (<any>Object).values(this.cbuForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return
    }

    if (this.bancoCtrl.invalid) {
      this.bancoCtrl.markAsTouched();
      return
    }

    if (this.bancoCtrl.value) {
      if (this.bancoCtrl.value.id == null) {
        this.bancoCtrl.setValue('');
        this.utilService.notification('Debe seleccionar un banco de la lista', 'warning');
        return
      }
    }

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
    if (this.tcForm.invalid) {
      (<any>Object).values(this.tcForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return
    }
    let formaDePagoConvenioDTO = new FormaDePagoConvenioDTO();
    formaDePagoConvenioDTO.codigoTarjeta = this.bancoTC;
    formaDePagoConvenioDTO.numeroTarjeta = this.tcForm.value["nrotarjeta"];
    formaDePagoConvenioDTO.fechaVencimiento = this.tcForm.value["vencimiento"];
    formaDePagoConvenioDTO.idConvenio = this.convenioIdFlag;
    formaDePagoConvenioDTO.bancoEmisor = this.bancoTC;
    formaDePagoConvenioDTO.descripcion = 'TC';
    console.log(formaDePagoConvenioDTO);
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
      .subscribe(res => {
        if (res == null) {
          this.utilService.notification('¡Forma de pago agregada con éxito!', 'success');
          this.fillFormaDePago();
        } else {
          this.utilService.openConfirmDialog(
            {
              titulo: 'No fue posible completar la acción',
              texto: res.detalle,
              confirmar: 'ACEPTAR'
            });
        }
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
        console.log(this.formaPagoDataSource.data);
      }).add(() => {
        this.isPosting = false;
      });
  }

  forma_pago = new FormControl();

  checkFormaPago() {
    return (this.forma_pago.value == 'tc') ? 'tc' : 'cbu';
  }

  tipo: string;

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

    this.formaPagoService.getFormaDePagodetalle(this.convenioIdFlag, data.descripcion)
      .subscribe(res => {

        if (res) {

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

          switch (tipo) {
            case 'TC':
              parsedData.datos = {
                bancoId: res.codigoTarjeta,
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

          console.log(this.tarjetasList);

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