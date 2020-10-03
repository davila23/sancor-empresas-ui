import { Component, OnInit, OnDestroy, ViewChild, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { SucursalesService } from '@app/services/empresa/convenios/alta-wizard/componentes/sucursales.service';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { SucursalEmpresaDTO } from '@app/models/sucursal-empresa.model';
import { LocalidadDTO } from '@app/models/localidad.model';
import { Subscription, Observable, of } from 'rxjs';
import { startWith, map, debounceTime, switchMap, catchError } from 'rxjs/operators';
import { UtilService } from '@app/core';
import { ContactoService } from '@app/services/empresa/convenios/alta-wizard/componentes/contacto.service';

@Component({
  selector: 'detalle-sucursales',
  templateUrl: './detalle-sucursales.component.html',
  styleUrls: ['./detalle-sucursales.component.scss']
})
export class DetalleSucursalesComponent implements OnInit {

  constructor(
    private _fb: FormBuilder,
    private service: ContactoService,
    private sucursalService: SucursalesService,
    private utilService: UtilService) {
    this.sucursalesForm = this._fb.group({
      descripcion: ['', [Validators.required]],
      domicilio: ['', [Validators.required, Validators.maxLength(20)]],
      email: ['', [Validators.email]],
      localidad: this._fb.group({
        codigoPostal: [''],
        detalle: [''],
        subCodigoPostal: [''],
        codigoPostalReal: [''],
        provincia: [''],
      }),
    });

    this.telefonoForm = this._fb.group({
      caracteristica: ['', Validators.required],
      numero: ['', Validators.required]
    });
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.sucursalDataSource.paginator = this.paginator;
  } private paginator: MatPaginator;

  @Input() set isEdition(isEdition) {

    this.isEditionFlag = isEdition;

  } isEditionFlag = false;

  @Input() set empresaId(empresaId) {

    this.empresaIdFlag = empresaId;

  } empresaIdFlag = null;

  @Input() set convenioId(convenioId) {

    this.convenioIdFlag = convenioId;
    this.fillSucursales();
  } convenioIdFlag = null;

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

  @Output() changeEditionFlag = new EventEmitter<boolean>();


  sucursalServiceSubject: Subscription;
  filteredLocalidades: Observable<any[]>;
  sucursalesForm: FormGroup;
  telefonoForm: FormGroup;

  dialogRef = null;
  isPosting = false;

  codPostalControl = new FormControl();
  codPostalList: any = [];

  sucursalItem: SucursalEmpresaDTO;

  edicionSucuExistente: boolean = false;
  currentSucursal: SucursalEmpresaDTO = null;

  sucursalDataSource = new MatTableDataSource<any>([]);
  //sucursal_list: any = [];
  sucursal_displayedColumns = [
    'descripcion',
    'domicilio',
    'telefono',
    'email',
    'localidad',
    'delete'
  ];

  ngOnInit() {
    console.log("INIT");
    this.fillSucursales();
    console.log("INIT");

  }

  fillSucursales() {
    this.sucursalService.getSucursalesEmpresaD(this.convenioIdFlag)
      .subscribe(res => {
        if (res == null) res = [];
        res.forEach(x => {
          x.email = x.email.trim();
        })
        this.sucursalDataSource.data = res;
      });
  }

  codigoPostalListFill(val) {
    setTimeout(() => {
      this.sucursalService.getLocalidades(val).subscribe(r => {
        this.codPostalList = r.listaResultado;
      });
    }, 350);
  }

  localidadPatchValue(item) {
    this.sucursalesForm.patchValue({
      localidad: item
    });
  }

  sucursalSaveAndRender() {

    if (this.sucursalesForm.invalid || this.telefonoForm.invalid) {
      (<any>Object).values(this.sucursalesForm.controls).forEach(control => {
        control.markAsTouched();
      });
      this.telefonoForm.markAsTouched();
      return
    }

    if (this.codPostalControl.invalid) {
      this.codPostalControl.markAsTouched();
      return
    }

    if (this.sucursalesForm.valid || this.codPostalControl.valid) {

      this.isPosting = true;

      this.sucursalItem = this.sucursalesForm.value as SucursalEmpresaDTO;
      this.sucursalItem.empresaId = this.convenioIdFlag;
      this.sucursalItem.estado = 0;
      this.sucursalItem.idSucursal = null;
      this.sucursalItem.categoria = this.telefonoForm.controls['caracteristica'].value;
      this.sucursalItem.telefono = this.telefonoForm.controls['numero'].value;

      this.sucursalService.addSucursalEmpresaD(this.sucursalItem)
        .subscribe(res => {
          if (res.length == 0) {
            this.utilService.notification('¡Sucursal agregada con éxito!', 'success', 4000);
            this.resetForms();
            this.fillSucursales();
          } else {
            if (res[0].detalle) {
              this.utilService.openConfirmDialog(
                {
                  titulo: 'No fue posible completar la acción',
                  texto: res[0].detalle,
                  confirmar: 'ACEPTAR'
                });
            }
          }
        }).add(() => {
          this.isPosting = false;
        });
    }

  }

  sucursalEditAndRender() {

    if (this.sucursalesForm.invalid || this.telefonoForm.invalid) {
      (<any>Object).values(this.sucursalesForm.controls).forEach(control => {
        control.markAsTouched();
      });
      this.telefonoForm.markAsTouched();
      return
    }

    if (this.codPostalControl.invalid) {
      this.codPostalControl.markAsTouched();
      return
    }

    this.isPosting = true;

    this.sucursalItem = this.sucursalesForm.value as SucursalEmpresaDTO;
    this.sucursalItem.empresaId = this.convenioIdFlag;
    this.sucursalItem.estado = 0;
    this.sucursalItem.idSucursal = this.currentSucursal.idSucursal;
    this.sucursalItem.categoria = this.telefonoForm.controls['caracteristica'].value;
    this.sucursalItem.telefono = this.telefonoForm.controls['numero'].value;

    this.sucursalService.addSucursalEmpresaD(this.sucursalItem)
      .subscribe(res => {
        if (res.length == 0) {
          this.utilService.notification('¡Sucursal modificada con éxito!', 'success', 4000);
          this.cancelEdit();
          this.fillSucursales();
        } else {
          if (res[0].detalle) {
            this.utilService.openConfirmDialog(
              {
                titulo: 'No fue posible completar la acción',
                texto: res[0].detalle,
                confirmar: 'ACEPTAR'
              });
          }
        }
      }).add(() => {
        this.isPosting = false;
      });
  }

  sucursalEdit(row) {

    this.edicionSucuExistente = true;
    this.isEditionFlag = true;
    this.changeEditionFlag.emit(true);
    this.currentSucursal = row;
    this.sucursalesForm.patchValue(row);
    this.codPostalControl.setValue(row.localidad.codigoPostal);
    this.telefonoForm.controls['caracteristica'].setValue(row.categoria.trim());
    this.telefonoForm.controls['numero'].setValue(row.telefono.trim());

  }

  cancelEdit() {

    this.isEditionFlag = false;
    this.changeEditionFlag.emit(false);
    this.edicionSucuExistente = false;
    this.currentSucursal = null;
    this.resetForms();

  }

  resetForms() {

    this.sucursalesForm.reset();
    this.codPostalControl.reset();
    this.telefonoForm.reset();

  }

  sucursalDelete(sucursalItem: SucursalEmpresaDTO) {
    if (this.dialogRef === null) {
      this.dialogRef = this.utilService.openConfirmDialog({
        titulo: '',
        texto: '¿Desea eliminar este registro de sucursales?',
        confirmar: 'Eliminar',
        cancelar: 'Cancelar'
      });

      this.utilService.loseFocus();

      this.dialogRef.afterClosed().toPromise().then((respuesta) => {
        if (respuesta) {

          this.isPosting = true;

          this.sucursalService.deleteSucursarEmpresaD(sucursalItem)
            .subscribe(res => {
              this.utilService.notification('¡Sucursal eliminada con éxito!', 'success');
              this.fillSucursales();
            }).add(() => {
              this.isPosting = false;
            });
        }

        this.dialogRef = null;
      });
    }
  }

}
