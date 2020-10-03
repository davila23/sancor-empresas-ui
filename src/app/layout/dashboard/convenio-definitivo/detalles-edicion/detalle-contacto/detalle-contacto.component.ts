import { Component, OnInit, Input, ViewChildren, QueryList, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { LoadingDirective } from '@app/shared/loading.directive';
import { ContactoService } from '@app/services/empresa/convenios/alta-wizard/componentes/contacto.service';
import { UtilService } from '@app/core';
import { EmpresaService } from '@app/services/empresa/empresa.service';

@Component({
  selector: 'detalle-contacto',
  templateUrl: './detalle-contacto.component.html',
  styleUrls: ['./detalle-contacto.component.scss']
})
export class DetalleContactoComponent implements OnInit {

  constructor(
    private _fb: FormBuilder,
    private _service: ContactoService,
    private _empresaService: EmpresaService,
    private _utilService: UtilService) {
    this.contactoForm = this._fb.group({
      empresaId: [null, [Validators.required]],
      codigoDomicilio: [null],
      calle: [null, [Validators.required]],
      numero: [null, [Validators.required, Validators.max(99999)]],
      piso: [null],
      barrio: [null],
      departamento: [null],
      codigoPostal: [null, [Validators.required]],
      cpArgentino: [null],
      recibeCorrespondencia: ['S'],
      localidadId: [null, [Validators.required]],
      edición: [false],
      orientacion: [null],
      otrosDatos1: [null],
      otrosDatos2: [null],
      otrosDatos3: [null],
      otrosDatos4: [null],
      esPrincipal: true
    });

    this.telefonosForm = this._fb.group({
      empresaId: [null, Validators.required],
      domicilioId: ['', Validators.required],
      codigoTelefonoMail: [null],
      tipoTelefono: ['C', Validators.required],
      caracteristica: ['', Validators.required],
      numero: ['', Validators.required],
      observaciones: ['']
    });
  }

  @ViewChildren(LoadingDirective) loadings: QueryList<LoadingDirective>;

  controlsLoading: any = {
    contacto: {
      isLoading: true,
      descripcion: 'contacto',
      type: 'table'
    }
  };

  @Output() setForms: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();

  @Input() set empresaId(empresaId) {
    setTimeout(() => {
      this.empresaIdFlag = empresaId;
    });
  }

  @Input() set isEdition(isEdition) {
    setTimeout(() => {
      this.isEditionFlag = isEdition;

      (isEdition) ? this.contactoForm.enable() : this.contactoForm.disable();
      (isEdition) ? this.codPostalControl.enable() : this.codPostalControl.disable();
    });
  }

  @Input() set convenioId(convenioId) {
    setTimeout(() => {
      this.convenioIdFlag = convenioId;

      this.contactoForm.patchValue({ empresaId: Number(convenioId) });
      this.telefonosForm.patchValue({ empresaId: Number(convenioId) });
      this.fillForm();
    });
  }

  @Input() set isAllowedToEdit(boolean) {
    setTimeout(() => {
      this.edit = boolean;
      if (!this.edit) {
        this.contactoForm.disable();
        this.codPostalControl.disable();
      }
    });
  }

  @Input() set isAllowedToDelete(boolean) {
    setTimeout(() => {
      this.delete = boolean;
    });
  }

  edit = false;
  delete = false;

  isPosting = false;

  empresaIdFlag;
  convenioIdFlag;
  isEditionFlag;

  codPostalControl = new FormControl('', [Validators.required]);
  codPostalList: any = [];

  contactoForm: FormGroup;
  telefonosForm: FormGroup;

  telefonosEmails: any = [];

  dialogRef = null;

  ngOnInit() { }

  fillForm() {
    this._service.getDomiciliosTemporalesD(this.convenioIdFlag).subscribe(r => {

      if (!r.length) {
        this._empresaService.getEmpresaById(this.empresaIdFlag).subscribe(r => {

          let x = r[0];

          this.contactoForm.patchValue({
            calle: x.calle,
            numero: x.numeroCalle,
            departamento: x.departamento,
            piso: x.piso
          });

        });

        return false;
      }

      const sortedResponse = r.sort((leftSide, rightSide): number => {

        if (leftSide.esPrincipal > rightSide.esPrincipal) return -1;
        if (leftSide.esPrincipal < rightSide.esPrincipal) return 1;

      });

      let x = sortedResponse[0];

      this.telefonosEmails = x.listaTelefonos;

      this.contactoForm.patchValue({
        barrio: x.barrio,
        calle: x.calle,
        codigoDomicilio: x.codigoDomicilio,
        cpArgentino: x.cpArgentino,
        departamento: x.departamento,
        numero: x.numero,
        orientacion: x.orientacion,
        otrosDatos1: x.otrosDatos1,
        otrosDatos2: x.otrosDatos2,
        otrosDatos3: x.otrosDatos3,
        otrosDatos4: x.otrosDatos4,
        piso: x.piso,
        codigoPostal: x.localidad.codigoPostal,
        localidadId: x.localidad.codigoPostal,
      });

      this.codPostalControl.setValue(x.localidad.codigoPostal);

      this.telefonosForm.patchValue({
        domicilioId: x.codigoDomicilio
      });
    }).add(() => {
      this._utilService.setControlsLoadingState('contacto', false, this.loadings);
    });
  }

  codigoPostalListFill(val) {
    setTimeout(() => {
      this._service.getLocalidades(val).subscribe(r => {
        this.codPostalList = r.listaResultado;
      });
    }, 400);
  }

  codigoPostalPatchValue() {
    const val = this.codPostalControl.value;
    this.contactoForm.patchValue({
      codigoPostal: val,
      localidadId: val,
      cpArgentino: String(val)
    });
  }

  saveAndRenderContacto() {
    if (this.contactoForm.invalid || this.codPostalControl.invalid) {
      this.contactoForm.markAsTouched();
      this.codPostalControl.markAsTouched();
      return
    }

    this.isPosting = true;
    this._service.postDomicilioD(this.contactoForm.value)
      .subscribe(r => {
        this._utilService.notification('Registro añadido con éxito!', 'success', 4000);
        this.resetNumeroCarac();
      }).add(() => {
        this.isPosting = false;
      });
  }

  saveAndRenderTel() {

    if (this.telefonosForm.invalid) {
      this.telefonosForm.markAsTouched();
      return
    }

    if (this.dialogRef === null) {

      this.dialogRef = this._utilService.openConfirmDialog({
        titulo: 'Dialogo de confirmación',
        texto: '¿Desea añadir el registro?',
        confirmar: 'Añadir',
        cancelar: 'Cancelar'
      });

      this._utilService.loseFocus();

      this.dialogRef.afterClosed().toPromise().then((respuesta) => {

        if (respuesta) {

          this.isPosting = true;

          if (this.telefonosForm.value.tipoTelefono === 'E') {
            this._service.postTelD(this.telefonosForm.value)
              .subscribe(r => {
                this._utilService.notification('Registro añadido con éxito!', 'success', 4000);
                this.resetNumeroCarac();
              }).add(() => {
                this.isPosting = false;
              });
          } else {
            this._service.postValidarTel(this.telefonosForm.value)
              .subscribe(r => {
                if (r.length === 0) {
                  this._service.postTelD(this.telefonosForm.value)
                    .subscribe(r => {
                      this._utilService.notification('Registro añadido con éxito!', 'success', 4000);
                      this.resetNumeroCarac();
                    }).add(() => {
                      this.isPosting = false;
                    });
                } else {
                  this._utilService.notification('Caracteristica Invalida', 'warning', 4000);
                  this.fillForm();
                }
              }).add(() => {
                this.isPosting = false;
              });
          }
        }

        this.dialogRef = null;
      });
    }
  }


  validateTel() {
    this._service.postValidarTel(this.telefonosForm.value).subscribe(r => {
      this._utilService.notification('Caracteristica MAL', 'warning', 4000);
      this.fillForm();
    });
  }

  delTel(val) {
    if (this.dialogRef === null) {
      this.dialogRef = this._utilService.openConfirmDialog({
        titulo: 'Dialogo de confirmación',
        texto: '¿Desea eliminar este registro de telefono/email?',
        confirmar: 'Eliminar',
        cancelar: 'Cancelar'
      });

      this._utilService.loseFocus();

      this.dialogRef.afterClosed().toPromise().then((respuesta) => {

        if (respuesta) {
          this.isPosting = true;

          this._service.deleteTelD({
            "empresaId": val.empresaId,
            "codigoTelefonoMail": val.codigoTelefonoMail,
            "domicilioId": this.contactoForm.value.codigoDomicilio
          }).subscribe(r => {
            this._utilService.notification('Registro eliminado con éxito!', 'success', 4000);
            this.fillForm();
          }).add(() => {
            this.isPosting = false;
          });
        }

        this.dialogRef = null;
      });
    }
  }

  resetNumeroCarac() {
    if (this.telefonosForm.value.tipoTelefono == 'E') {
      this.telefonosForm.controls['caracteristica'].clearValidators();
      this.telefonosForm.controls['caracteristica'].updateValueAndValidity({ emitEvent: false });

      this.telefonosForm.controls['numero'].setValidators(Validators.email);
      this.telefonosForm.controls['numero'].updateValueAndValidity({ emitEvent: false });
    } else {
      this.telefonosForm.controls['caracteristica'].setValidators(Validators.required);
      this.telefonosForm.controls['caracteristica'].updateValueAndValidity({ emitEvent: false });

      this.telefonosForm.controls['numero'].clearValidators();
      this.telefonosForm.controls['numero'].setValidators(Validators.required);
      this.telefonosForm.controls['numero'].updateValueAndValidity({ emitEvent: false });
    }

    this.telefonosForm.patchValue({
      caracteristica: '',
      numero: '',
      observaciones: ''
    });

    this.telefonosForm.markAsPristine();
    this.telefonosForm.markAsUntouched();

    this.fillForm();
  }

}
