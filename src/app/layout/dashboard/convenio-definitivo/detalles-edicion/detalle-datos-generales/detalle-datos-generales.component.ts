import { Component, OnInit, Output, EventEmitter, Input, ViewChildren, QueryList } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { DatosGeneralesService } from '@app/services/empresa/convenios/alta-wizard/componentes/datos-generales.service';
import { LoadingDirective } from '@app/shared/loading.directive';
import { UtilService } from '@app/core';
import { Router } from '@angular/router';
import * as dayjs from 'dayjs';

@Component({
  selector: 'detalle-datos-generales',
  templateUrl: './detalle-datos-generales.component.html',
  styleUrls: ['./detalle-datos-generales.component.scss']
})
export class DetalleDatosGeneralesComponent implements OnInit {

  constructor(private _fb: FormBuilder,
              private service: DatosGeneralesService,
              private utilService: UtilService,
              private router: Router) {

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
          idpersona: [''],
          nombre: ['', Validators.required]
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
          idpersona: [''],
          nombre: ['', [Validators.required]]
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
        carEntidadDescripcion: [''],
        enviosCredenciales: this._fb.group({
          id: [null, Validators.required],
          descripcion: [null]
        }),
        firmaDes: [null],
        observaciones: [null, [Validators.maxLength(255)]]
      });
  
      this.credencialesForm = this._fb.group({
        carEntidadId: [],
        descripcion: [],
        recepcionista: []
      });
  }

  @ViewChildren(LoadingDirective) loadings: QueryList<LoadingDirective>;


  @Input() set isEdition(isEdition) {
    setTimeout(() => {
      this.isEditionFlag = isEdition;

      (isEdition) ? this.datosGeneralesForm.enable() : this.datosGeneralesForm.disable();

      this.datosGeneralesForm.controls['modalidadLiquidacion'].disable();
    });
  }

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

  // #section
  // public enableDisableControl(group: FormGroup | FormArray): void {
  //   Object.keys(group.controls).forEach((key: string) => {
  //     const abstractControl = group.controls[key];

  //     if (abstractControl instanceof FormGroup || abstractControl instanceof FormArray) {
  //         this.enableDisableControl(abstractControl);
  //     } else {
  //       if (this.isEditionFlag) {
  //         abstractControl.enable();
  //       } else {
  //         abstractControl.disable();
  //       }
  //     }
  //   });
  // }
  // #endsection

  isEditionFlag = false;
  empresaIdFlag = null;
  convenioIdFlag = null;

  credencialesForm: FormGroup;
  datosGeneralesForm: FormGroup;

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
  credencialesList: any;

  // Fill form from the database
  fillForm() {
    setTimeout(() => {
      this.service.getDatosGeneralesD(this.convenioIdFlag).subscribe(r => {
        //console.log('R', r);
        if (!r.length) {
          this.utilService.notification('Convenio inexistente', 'error', 1000);
          this.router.navigate(['/404']);
          return;
        }
        const parsedR = r[0];

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
      });
    });
  }

  fillSelects() {
    this.service.getHoldingsList().subscribe(r => {
      this.holdingsList = r;
    });

    this.service.getMovimientoAsociado().subscribe(r => {
      this.movimientosAsociadosList = r;
    });

    this.service.getCredenciales().subscribe(r => {
      this.credencialesList = r;
    });

    this.service.getTipoIngresoList().subscribe(r => {
      this.tipoIngresoList = r;
    });
  }

  postDatosGenerales() {
    let newDate = dayjs(this.datosGeneralesForm.value.vigenciaDesde).format('YYYY-MM-DD');
    let validatedForm = this.datosGeneralesForm.getRawValue();

    validatedForm.carEntidadId = this.credencialesForm.value.carEntidadId;
    validatedForm.recepcionista = this.credencialesForm.value.recepcionista;

    validatedForm.vigenciaDesde = newDate;

    this.service.actualizarDatosGenerales(validatedForm).subscribe(r => {
      this.utilService.notification('¡Datos generales actualizado!', 'success', 1000);
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
    });

    this.fillSelects();
    this.fillForm();
  }
}
