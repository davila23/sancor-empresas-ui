import { Component, OnInit, Output, EventEmitter, Input, ViewChildren, QueryList } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatosGeneralesService } from '@app/services/empresa/convenios/alta-wizard/componentes/datos-generales.service';
import { LoadingDirective } from '@app/shared/loading.directive';
import { UtilService } from '@app/core';
import { DataTransferService } from '@app/services/common/data-transfer.service';
import { Router } from '@angular/router';
import * as dayjs from 'dayjs';
import { DatosImpositivosService } from '@app/services/empresa/convenios/alta-wizard/componentes/datos-impositivos.service';
import { DatosImpositivosDTO } from '@app/models/datos-impositivos.model';
import { ControlConvenioService } from '@app/services/control/control-convenio.service';
import { ConvenioMovimientoDTO } from '@app/models/convenio-movimiento.model';

@Component({
  selector: 'app-datos-generales',
  templateUrl: './datos-generales.component.html',
  styleUrls: ['./datos-generales.component.scss']
})
export class DatosGeneralesComponent implements OnInit {

  constructor(private _fb: FormBuilder,
              private service: DatosGeneralesService,
              private utilService: UtilService,
              private router: Router,
              private _dataTransferService: DataTransferService,
              private datosImpositivosService: DatosImpositivosService,
              private controlConvenioService: ControlConvenioService) {

    this.datosGeneralesForm = this._fb.group({
      id: [null],
      nombre: [null, [Validators.required, Validators.maxLength(50)]],
      empresa: this._fb.group({
        id: [null, Validators.required]
      }),
      vigenciaDesde: [null, [Validators.required]],
      ramo: this._fb.group({
        id: 15,
        descripcion: 'EMPRESAS CON CONVENIO'
      }),
      codigoAgrupacion: [0],
      contratoPorBonificacion: ['S', [Validators.required]],
      habilitadoSistemaRecepcion: ['N'],
      compensaAportes: [null, [Validators.required]],
      modalidadLiquidacion: this._fb.group({
        id: [{disabled: true, value: 2}]
      }),
      cantidadEmpleados: [null, [Validators.required]], //Cantidad cápitas prometidas
      horarioAtencion: [''],
      ejecutivoConvenio: this._fb.group({
        idpersona: [null],
        nombre: [null, Validators.required]
      }),
      tipoConvenio: this._fb.group({ //
        id: [2]
      }),
      aceptaMonotributistas: [null, [Validators.required]],
      holding: this._fb.group({
        id: [null],
        descripcion: [null]
      }),
      relacionista: this._fb.group({
        idpersona: [null],
        nombre: [null]
      }),
      mutual: [null, [Validators.required]],
      facturaElectronica: [null, [Validators.required]],
      interesComercial: ['N', [Validators.required]],
      documentacionConvenio: ['Documentacion CONVENIO'],
      estado: ['B'],
      tipoIngreso: this._fb.group({
        id: [null, Validators.required]
      }),
      tipoMovimientoAsociado: this._fb.group({
        id: [null, Validators.required]
      }),
      adicionalACargo: [null, Validators.required],
      copagosACargo: [null, Validators.required],
      recepcionista: [null],
      carEntidadId: [null], //Revisar TODO
      carEntidadDescripcion: [null],
      enviosCredenciales: this._fb.group({
        id: [null, Validators.required],
        descripcion: [null]
      }),
      firmaDes: [null],
      observaciones: [null, [Validators.maxLength(500)]]
    });

    this.credencialesForm = this._fb.group({
      carEntidadId: [],
      descripcion: [],
      recepcionista: []
    });
  }

  @ViewChildren(LoadingDirective) loadings: QueryList<LoadingDirective>;

  @Output() setForms: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  @Output() observacion: EventEmitter<any> = new EventEmitter<any>();

  @Input() set isEdition(isEdition) {
    setTimeout(() => {
      if (isEdition) {
        let x = this._dataTransferService.value;
        if (x) {

          if (x.relacionista == null) x.relacionista = {idpersona: null, nombre: null};

          this.datosGeneralesForm.setValue(x);
          if (x.carEntidadId != null) {
            this.service.getEntidades(x.carEntidadId).subscribe(r => {
              this.credencialesForm.patchValue({
                carEntidadId: r.data.entidades[0].id,
                descripcion: r.data.entidades[0].descripcion,
                recepcionista: x.recepcionista
              });
            });
          }
          this.utilService.setControlsLoadingState('parteUno', false, this.loadings);
        } else {
          this.fillForm();
        }
      } else {
        this.utilService.setControlsLoadingState('parteUno', false, this.loadings);
      }
      this.isEditionFlag = isEdition;
    });
  }

  @Input() set isAllowedToEdit(boolean) {
    setTimeout( () => {
      this.edit = boolean;
      if (!this.edit) {
        this.datosGeneralesForm.disable();
        this.credencialesForm.disable();
      }
    });
  } edit = false;

  @Input() set empresaId(empresaId) {

    setTimeout(() => {
      this.datosGeneralesForm.patchValue({empresa: {id: Number(empresaId)}});
      this.empresaIdFlag = empresaId;
    });
  }

  @Input() set convenioId(convenioId) {
    setTimeout(() => {
      this.convenioIdFlag = convenioId;
    });
  }

  isEditionFlag = false;
  empresaIdFlag = null;
  convenioIdFlag = null;

  datosGeneralesForm: FormGroup;
  credencialesForm: FormGroup;

  controlsLoading: any = {
    holdings: {
      isLoading: true,
      descripcion: 'holdings'
    },
    tipoIngreso: {
      isLoading: true,
      descripcion: 'tipos de ingreso'
    },
    movimientosAsociados: {
      isLoading: true,
      descripcion: 'movimientos de asociados'
    },
    credenciales: {
      isLoading: true,
      descripcion: 'credenciales'
    },
    parteUno: {
      isLoading: true,
      descripcion: 'parteUno',
      type: 'table'
    }
  };

  // is posting flag
  isPosting = false;

  // Disable relacionista Convenio
  disabled = true;

  // Show/Hide firmaDes
  showFirmaDes = false;
  // Show/Hide Credenciales
  showCredenciales = false;
  // Selects data
  holdingsList: any;
  tipoIngresoList: any;
  movimientosAsociadosList: any;
  credencialesList:any;

  // Fill form from the database
  fillForm() {
    setTimeout(() => {
      if (this.isEditionFlag) {
        this.service.getDatosGenerales(this.convenioIdFlag).subscribe(r => {
          if (!r.length) {
            this.utilService.notification('Convenio inexistente', 'error', 1000);
            this.router.navigate(['/empresa']);
            return;
          }
          const parsedR = r[0];

          this.observacion.emit({
            estadoControlId: parsedR.estadoControlId,
            observacion: parsedR.observacionControl
          });

          parsedR.vigenciaDesde = (parsedR.vigenciaDesde) ? dayjs(parsedR.vigenciaDesde) : null;

          parsedR.modalidadLiquidacion.id = 2;

          if (parsedR.carEntidadId != null) {
            this.service.getEntidades(parsedR.carEntidadId).subscribe(r => {
              this.credencialesForm.patchValue({
                carEntidadId: r.data.entidades[0].id,
                descripcion: r.data.entidades[0].descripcion,
                recepcionista: parsedR.recepcionista
              });
            });
          }

          this.datosGeneralesForm.patchValue(parsedR);
          this.utilService.setControlsLoadingState('parteUno', false, this.loadings);
        });
      }
    });
  }

  fillSelects() {
    this.service.getHoldingsList().subscribe(r => {
      this.holdingsList = r;
      this.utilService.setControlsLoadingState('holdings', false, this.loadings);
    });

    this.service.getMovimientoAsociado().subscribe(r => {
      this.movimientosAsociadosList = r;
      this.utilService.setControlsLoadingState('movimientos de asociados', false, this.loadings);
    });

    this.service.getCredenciales().subscribe(r => {
      this.credencialesList = r;
      this.utilService.setControlsLoadingState('credenciales', false, this.loadings);
    });

    this.service.getTipoIngresoList().subscribe(r => {
      this.tipoIngresoList = r;
      this.utilService.setControlsLoadingState('tipos de ingreso', false, this.loadings);
    });
  }

  postDatosGenerales() {
    this.isPosting = true;

    let newDate = dayjs(this.datosGeneralesForm.value.vigenciaDesde).format('YYYY-MM-DD');
    let validatedForm = this.datosGeneralesForm.getRawValue();

    validatedForm.carEntidadId = this.credencialesForm.value.carEntidadId;
    validatedForm.recepcionista = this.credencialesForm.value.recepcionista;
    validatedForm.carEntidadDescripcion = this.credencialesForm.value.descripcion;
    

    if (validatedForm.holding.id == null) validatedForm.holding.id = 0;

    this.setForms.emit(validatedForm);

    if (validatedForm.relacionista.idpersona == null) validatedForm.relacionista = null;

    validatedForm.vigenciaDesde = newDate;

    this.service.postDatosGenerales(validatedForm).subscribe(r => {
      if (!this.isEditionFlag) {

        //postear Estado
        this.postInitialStateConvenio(r.convenioId);

        this.datosGeneralesForm.patchValue({id: r.convenioId});
        this._dataTransferService.value = validatedForm;
        this.router.navigate([`/conveniostemporales/empresa/${this.datosGeneralesForm.value.empresa.id}/edicion/${r.convenioId}`]);
        this.utilService.notification('¡Convenio creado correctamente!', 'success', 2000);
      } else {
        this.utilService.notification('¡Datos generales actualizado!', 'success', 1000);
      }
    }).add(() => {
      this.isPosting = false;
    });
  }

  ejecutivoConvenioCustom = (busqueda) => {
    return new Promise(resolve => {
      this.service.getEjecutivoConvenio(busqueda).subscribe((datos) => resolve(datos.listaResultado));
    });
  }

  entidadesCustom = (busqueda) => {
    return new Promise(resolve => {         // en el resolve le indicás donde está el array que contiene los resultados a mostrar.
      this.service.getEntidades(busqueda).subscribe((datos) => resolve(datos.data.entidades));
    });
  }

  postInitialStateConvenio(convenioId:number){
    let convenioMovimientoDTO = new ConvenioMovimientoDTO();
    convenioMovimientoDTO.idConvenioEstado = 1;
    convenioMovimientoDTO.idConvenio = convenioId;
    convenioMovimientoDTO.usuario = 'SUPERVISOR';
    convenioMovimientoDTO.observacion = 'CARGA INICIAL';
    this.controlConvenioService.addConvenioMovimiento(convenioMovimientoDTO).subscribe();
    //VER DONDE TIENE QUE IR
  }

  postDatosImpositivos(convenioId:number){
    // aca deberia estar las llamadas para el servicio DATOS IMPOSITIVOS
    let datosImpositivosItem = new DatosImpositivosDTO;
    datosImpositivosItem.empresaId = this.empresaIdFlag;
    datosImpositivosItem.convenioId = convenioId;
    datosImpositivosItem.facturadoraId = 2;//Empresas que facturan: 2
    datosImpositivosItem.modalidad = 'C'; // Mod Impresion: Conceptos,
    datosImpositivosItem.tipoComprobante = 'F'; // Tipo comprobante: Factura,
    //se llama al servicio con facturadora 2
    this.datosImpositivosService.addDatosImpositivos(datosImpositivosItem).subscribe(res=>console.log(res));

    datosImpositivosItem.facturadoraId = 5;//Empresas que facturan: 5
    //se llama al servicio con facturadora 5
    this.datosImpositivosService.addDatosImpositivos(datosImpositivosItem).subscribe(res=>console.log(res));
  }

  listenCredencialesId(value) {
    if (value != 3) {
      this.showCredenciales = false;
      this.credencialesForm.controls['carEntidadId'].setValue(null);
      this.credencialesForm.controls['carEntidadId'].clearValidators();
      this.credencialesForm.controls['descripcion'].setValue(null);
      this.credencialesForm.controls['descripcion'].clearValidators();
      this.credencialesForm.controls['recepcionista'].setValue(null);
      this.credencialesForm.controls['recepcionista'].clearValidators();
    } else {
      this.credencialesForm.controls['carEntidadId'].setValidators(Validators.required);
      this.credencialesForm.controls['descripcion'].setValidators(Validators.required)
      this.credencialesForm.controls['recepcionista'].setValidators(Validators.required);

      this.showCredenciales = true;
    }

    this.credencialesForm.controls['carEntidadId'].updateValueAndValidity({emitEvent: false});
    this.credencialesForm.controls['descripcion'].updateValueAndValidity({emitEvent: false});
    this.credencialesForm.controls['recepcionista'].updateValueAndValidity({emitEvent: false});
  }

  ngOnInit() {
    this.datosGeneralesForm.valueChanges.subscribe(r => {
      this.showFirmaDes = (r.tipoIngreso.id == 3) ? true : false;
      r.firmaDes = (r.tipoIngreso.id != 3) ? null : r.firmaDes;

      this.listenCredencialesId(r.enviosCredenciales.id);

      this.setForms.emit(this.datosGeneralesForm);
    });

    this.fillSelects();
  }
}
