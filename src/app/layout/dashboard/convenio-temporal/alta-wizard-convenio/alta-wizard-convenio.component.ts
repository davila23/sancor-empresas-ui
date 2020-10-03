import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { UtilService } from '@app/core';
import { CdkStep } from '@angular/cdk/stepper';
import { FormasDePagoService } from '@app/services/empresa/convenios/alta-wizard/componentes/formas-de-pago.service';
import { ConvenioMovimientoDTO } from '@app/models/convenio-movimiento.model';
import { ControlConvenioService } from '@app/services/control/control-convenio.service';
import { EmpresaService } from '@app/services/empresa/empresa.service';

@Component({
  selector: 'app-alta-wizard-convenio',
  templateUrl: './alta-wizard-convenio.component.html',
  styleUrls: ['./alta-wizard-convenio.component.scss']
})
export class AltaWizardConvenioComponent implements OnInit {

  constructor(
    private _fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private utilService: UtilService,
    private formasPagoService: FormasDePagoService,
    private controlConvenioService: ControlConvenioService,
    private _utilService: UtilService,
    private empresaService: EmpresaService) {

    this.empresaId = this.activatedRoute.snapshot.params.empresaId || null;
    this.convenioId = this.activatedRoute.snapshot.params.convenioId || null;

    this.permisos = JSON.parse(localStorage.getItem('steps')).temporal;

    if (this.empresaId && this.convenioId) {

      this.isEdition = true;
    } else {

      this.isEdition = false;
    }

    if (localStorage.getItem('bancos') == null) {
      this.formasPagoService.getBancos().subscribe(
        res => {
          localStorage.setItem('bancos', JSON.stringify(res));
        }
      )
    }

    this.formObservaciones = this._fb.group({
      observaciones: ['', [Validators.required]]
    });

    console.log(this.renderSteps('lectura', 'contacto'));

    if (!this.isEdition) {
      this.empresaService.validaUnicidadConvenio(this.empresaId).subscribe(
        x => {
          if (x.codigo != 200) {
            this.fallaConvenioUnico('No es posible agregar un convenio a esta empresa, ya existe uno en estado de Control o Corrección.');
          }
        });
    }
  }

  permisos = [];

  @ViewChild('stepper') stepper: MatStepper;
  alreadySelectedSteps: CdkStep[] = [];

  // Es edicion o alta
  isEdition = false;

  // Stepper linear
  isLinear = false;

  empresaId = null;
  convenioId = null;

  datosGeneralesForm: FormGroup;
  contactoForm: FormGroup;
  archivosForm: FormGroup;
  formObservaciones: FormGroup;

  listadoMensajes: any[] = [];

  observacion = {
    show: false,
    code: 2,
    mensaje: ''
  }

  dialogRef = null;

  ngOnInit() {
    setTimeout(() => {
      this.alreadySelectedSteps.push(this.stepper._steps.first);
    });
  }

  fallaConvenioUnico(texto: string) {
    if (this.dialogRef === null) {
      this.dialogRef = this.utilService.openConfirmDialog({
        titulo: 'Advertencia:',
        texto: `${texto}`,
        confirmar: 'Aceptar'
      });

      this.utilService.loseFocus();

      this.dialogRef.afterClosed().toPromise().then((respuesta) => {
        this.router.navigate([`/empresa/busqueda`]);
        this.dialogRef = null;
      });
    }
  }

  renderSteps(action: string, step: string) {
    // for (let i = 0; i < this.permisos.length; i++) {
    //   if (this.permisos[i].stepName == step.toUpperCase()) {
    //     switch(action) {
    //       case 'lectura':
    //         return this.permisos[i].lectura;

    //       case 'delete':
    //         return this.permisos[i].delete;  

    //       case 'edicion':
    //         return this.permisos[i].edicion;
    //     }
    //   } else {
    //     return true;
    //   }
    // }

    // return false;

    if (this.permisos.length > 0) {
      let element = this.permisos.filter(x => x.stepName === step.toUpperCase());
      if (element.length > 0) {
        switch (action) {
          case 'lectura':
            return element[0].lectura;
          case 'delete':
            return element[0].delete;
          case 'edicion':
            return element[0].edicion;
        }
      } else {
        return true;
      }
    } else {
      this._utilService.notification('No se pudo validar tus permisos.', 'warning');
      return false;
    }
  }

  selectionChange($event) {
    const selectedStep = $event.selectedStep;

    if (!this.checkStep(selectedStep)) {
      this.alreadySelectedSteps.push(selectedStep);
    }

    this.isLinear = false;
    //this.isLinear = (this.datosGeneralesForm.invalid) ? true : false;
  }

  checkStep(step) {
    return (this.alreadySelectedSteps.includes(step)) ? true : false;
  }

  setForms(formDesc: string, form: FormGroup) {
    switch (formDesc) {
      case 'datosGeneralesForm':
        this.datosGeneralesForm = form;
        break;
      case 'contactoForm':
        this.contactoForm = form;
        break;
    }
    this.isLinear = false; //(form.invalid) ? true : false;
  }

  setObservacionMsg($obj) {
    this.observacion.code = $obj.estadoControlId,
      this.observacion.mensaje = $obj.observacion
  }

  removeMsg($code) {
    let listadoTemp = [];
    for (let i in this.listadoMensajes) {
      if (!(this.listadoMensajes[i].codigoStep == $code.codigoStep && this.listadoMensajes[i].id == $code.id)) {
        listadoTemp.push(this.listadoMensajes[i]);
      }
    }
    this.listadoMensajes = listadoTemp;
  }

  addMsg($msg) {
    let listadoTemp = [];
    for (let i in this.listadoMensajes) {
      if (!(this.listadoMensajes[i].codigoStep == $msg.codigoStep && this.listadoMensajes[i].id == $msg.id)) {
        listadoTemp.push(this.listadoMensajes[i]);
      }
    }
    this.listadoMensajes = listadoTemp;
    this.listadoMensajes.push($msg);
  }


  enviarAControl() {

    if (this.listadoMensajes.length) {
      this.utilService.notification('Por favor, corregir los conflictos listados para poder enviar a control.', 'warning', 8000);
      return false;
    }

    if (this.dialogRef === null) {
      this.dialogRef = this.utilService.openConfirmDialog({
        titulo: 'Dialogo de confirmación',
        texto: '¿Desea enviar a control este convenio?',
        confirmar: 'Enviar',
        cancelar: 'Cancelar'
      });

      this.utilService.loseFocus();

      this.dialogRef.afterClosed().toPromise().then((respuesta) => {

        if (respuesta) {

          let convenioMovimientoDTO = new ConvenioMovimientoDTO();
          convenioMovimientoDTO.idConvenioEstado = 2;
          convenioMovimientoDTO.idConvenio = this.convenioId;
          convenioMovimientoDTO.usuario = 'SUPERVISOR';
          convenioMovimientoDTO.observacion = this.formObservaciones.get('observaciones').value;

          this.controlConvenioService.addConvenioMovimiento(convenioMovimientoDTO).subscribe();

          //VER DONDE TIENE QUE IR
          //tiene que ir al lista de convenios temporales

          this.router.navigate([`/conveniostemporales/listado`]);
        }

        this.dialogRef = null;
      });
    }

  }

}
