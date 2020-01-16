import { Component, OnInit, Input, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { UtilService } from '@app/core';
import { DatosGeneralesService } from '@app/services/empresa/convenios/alta-wizard/componentes/datos-generales.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { LoadingDirective } from '@app/shared/loading.directive';
import * as dayjs from 'dayjs';

@Component({
  selector: 'datos-generales-control',
  templateUrl: './datos-generales.component.html',
  styleUrls: ['./datos-generales.component.scss']
})
export class DatosGeneralesComponent implements OnInit {

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
      contratoPorBonificacion: [null, [Validators.required]],
      habilitadoSistemaRecepcion: ['N'],
      compensaAportes: [null, [Validators.required]],
      modalidadLiquidacion: this._fb.group({
        id: [{disabled: true, value: 2}],
        descripcion: ''
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
      holding: this._fb.group({ // TRAER LISTA POR SERVICIO, PENDIENTE DE DAVID
        id: [null],
        descripcion: [null]
      }),
      relacionista: this._fb.group({
        idpersona: [''],
        nombre: ['', [Validators.required]]
      }),
      mutual: [null, [Validators.required]],
      facturaElectronica: [null, [Validators.required]],
      interesComercial: ['N'],
      documentacionConvenio: ['Documentacion CONVENIO'],
      estado: ['B'],
      tipoIngreso: this._fb.group({
        id: [null, Validators.required],
        descripcion: ''
      }),
      tipoMovimientoAsociado: this._fb.group({
        id: [null, Validators.required],
        descripcion: ''
      }),
      adicionalACargo: [null, Validators.required],
      copagosACargo: [null, Validators.required],
      recepcionista: [null, Validators.required],
      carEntidadDescripcion: [''],
      carEntidadId: [null], //Revisar TODO
      enviosCredenciales: this._fb.group({
        id: [null, Validators.required],
        descripcion: [null]
      }),
      firmaDes: [null],
      observaciones: [null, [Validators.maxLength(255)]]
    });
  }

  @ViewChildren(LoadingDirective) loadings: QueryList<LoadingDirective>;

  @Input() set convenioId(convenioId) {
    setTimeout(() => {
      this.convenioIdFlag = convenioId;
      this.fillForm();
    });
  }

  convenioIdFlag = null;

  datosGeneralesForm: FormGroup;

  controlsLoading: any = {
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
      this.service.getDatosGenerales(this.convenioIdFlag).subscribe(r => {
        if (!r.length) {
          this.utilService.notification('Convenio inexistente', 'error', 1000);
          this.router.navigate(['/convenioscontrol']);
          return;
        }
        const parsedR = r[0];

        parsedR.vigenciaDesde = (parsedR.vigenciaDesde) ? dayjs(parsedR.vigenciaDesde) : null;
        parsedR.vigenciaDesde = (parsedR.vigenciaDesde) ? parsedR.vigenciaDesde.format('YYYY-MM-DD') : null;

        parsedR.contratoPorBonificacion = (parsedR.contratoPorBonificacion == 'S') ? 'Si' : 'No';
        parsedR.compensaAportes = (parsedR.compensaAportes == 'S') ? 'Si' : 'No';
        parsedR.aceptaMonotributistas = (parsedR.aceptaMonotributistas == 'S') ? 'Si' : 'No';
        parsedR.facturaElectronica = (parsedR.facturaElectronica == 'S') ? 'Si' : 'No';

        parsedR.mutual = (parsedR.mutual == 'S') ? 'Si' : 'No';

        if (parsedR.firmaDes) {
          parsedR.firmaDes = (parsedR.firmaDes == 'S') ? 'Si' : 'No';
        }

        this.showFirmaDes = (parsedR.tipoIngreso.id == 3) ? true : false;

        parsedR.adicionalACargo = (parsedR.mutual == 'A') ? 'Asociado' : 'Empresa';
        parsedR.copagosACargo = (parsedR.copagosACargo == 'A') ? 'Asociado' : 'Empresa';

        parsedR.modalidadLiquidacion.descripcion = 'Vencida';

        if (parsedR.carEntidadId != null) {
          this.service.getEntidades(parsedR.carEntidadId).subscribe(r => {
            this.datosGeneralesForm.patchValue({
              carEntidadDescripcion: r.data.entidades[0].descripcion
            });
          });
        }


        this.datosGeneralesForm.patchValue(parsedR);
        this.utilService.setControlsLoadingState('parteUno', false, this.loadings);
      });
    });
  }

  ejecutivoConvenioCustom = (busqueda) => {
    return new Promise(resolve => {
      this.service.getEjecutivoConvenio(busqueda).subscribe((datos) => resolve(datos.listaResultado));
    });
  }

  listenCredencialesId(value) {
    if (value != 3) {
      this.showCredenciales = false;
      this.datosGeneralesForm.controls['carEntidadId'].setValue(null);
      this.datosGeneralesForm.controls['recepcionista'].setValue(null);
      this.datosGeneralesForm.controls['carEntidadId'].clearValidators();
      this.datosGeneralesForm.controls['recepcionista'].clearValidators();
    } else {
      this.datosGeneralesForm.controls['carEntidadId'].setValidators(Validators.required);
      this.datosGeneralesForm.controls['recepcionista'].setValidators(Validators.required);
      this.showCredenciales = true;
    }

    this.datosGeneralesForm.controls['carEntidadId'].updateValueAndValidity({emitEvent: false});
    this.datosGeneralesForm.controls['recepcionista'].updateValueAndValidity({emitEvent: false});
  }

  ngOnInit() {

  }

}
