import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormControl } from '@angular/forms';
import { EmpresaService } from '@app/services/empresa/empresa.service';
import { Observable } from 'rxjs';
import { EmpresaDTO } from '@app/models/empresa/empresa.model';
import { tap, map, startWith } from 'rxjs/operators';
import { CondicionIvaService } from '@app/services/condicion-iva/condicion-iva.service';
import { CondicionIvaDTO } from '@app/models/empresa/condicion-iva-model';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatPaginator } from '@angular/material';
import { ActividadAfipDTO } from '@app/models/empresa/actividad-afip.model';
import { ContactoService } from '@app/services/empresa/convenios/alta-wizard/componentes/contacto.service';
import { UtilService } from '@app/core';
import { ResponsableNegocioDTO } from '@app/models/empresa/responsable-negocio.model';
import { CustomValidators } from '@app/shared/custom-validators';

@Component({
  selector: 'app-edit-empresa',
  templateUrl: './edit-empresa.component.html',
  styleUrls: ['./edit-empresa.component.scss']
})
export class EditEmpresaComponent implements OnInit {

  constructor(private empresaService: EmpresaService,
    private condicionIvaService: CondicionIvaService,
    private contactoService: ContactoService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private utilService: UtilService,
    private router: Router) {
    this.empresaId = this.route.snapshot.params["empresaId"];

    this.empresaService.getEmpresaById(this.empresaId).subscribe(console.log);

    this.condicionIvaService.getCondicionesIva()
      .subscribe(res => this.condicionesIva = res);

    this.actividades = JSON.parse(localStorage.getItem('actividades'));

    if (this.actividades == null) {
      this.empresaService.obtenerActividadesEmpresa()
        .subscribe(res => {
          localStorage.setItem('actividades', JSON.stringify(res));
        });
    }
  }

  CUIT_REGEX = /\b(20|23|24|27|30|33|34)(\-)?[0-9]{8}(\-)?[0-9]/g;
  CUIT_REGEX_STRICT = /\b(20|23|24|27|30|33|34)(\-)[0-9]{8}(\-)[0-9]/g;

  isCuitValid = true;

  actividadAfip: FormControl = new FormControl();
  codPostalControl: FormControl = new FormControl('', [Validators.required]);
  actividadCtrl: FormControl = new FormControl();
  condicionesIva: CondicionIvaDTO[];
  actividades: ActividadAfipDTO[] = [];
  filteredOptionsActividad: any;
  filteredActividades: Observable<any[]>;
  codPostalList: any = [];

  formGroup: FormGroup;
  respNegocioForm: FormGroup;
  empresa: Observable<EmpresaDTO>;
  empresaId: number;
  idCondivionIva: number;
  empresaUpdate: EmpresaDTO;
  empresaCopia: string;
  dialogRef = null;

  posting = false;
  loading = true;
  isPostingRN: boolean = false;
  currentRN: ResponsableNegocioDTO = null;

  listaResponsablesDeNegocio = new MatTableDataSource<ResponsableNegocioDTO>([]);
  isEditRN: boolean = false;
  listaResponsablesDeNegocio_displayedColumns = [
    'nombre',
    'numeroDocumento',
    'comentario',
    'accion'
  ];
  private paginator: MatPaginator;

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.listaResponsablesDeNegocio.paginator = this.paginator;
  }

  ngOnInit() {
    this.filteredActividades = this.actividadCtrl.valueChanges
      .pipe(
        startWith(''),
        map(actividad => actividad ? this.filterStates(actividad) : this.actividades.slice())
      );

    this.createForm();

    this.empresaService.getEmpresaById(this.empresaId)
      .subscribe(r => {
        let empresa = r[0];

        let cuit: string = String(empresa.cuit);

        if (!this.CUIT_REGEX_STRICT.test(cuit) && this.CUIT_REGEX.test(cuit)) {
          cuit = this.InsertAt(cuit, '-', 2);
          cuit = this.InsertAt(cuit, '-', cuit.length - 1);

          this.isCuitValid = this.CUIT_REGEX_STRICT.test(cuit);
        } else {
          this.isCuitValid = false;
        }

        empresa.cuit = cuit;

        if (empresa.actividadAfip) this.actividadCtrl.patchValue(empresa.actividadAfip.descripcion);
        if (empresa.cpArgentino) this.codPostalControl.patchValue(empresa.cpArgentino);

        if (empresa.telFijo) {
          empresa.telFijo = empresa.telFijo.trim();
        }

        if (empresa.email) {
          empresa.email = empresa.email.trim();
        }

        this.formGroup.patchValue(empresa);
        this.empresaCopia = JSON.stringify(this.formGroup.getRawValue());
      }).add(() => {
        this.loading = false;
      });

    this.getResponsablesDeNegocio();
  }

  getResponsablesDeNegocio() {
    this.isPostingRN = true;
    this.empresaService.getResponsablesNegocioByEmpresa(this.empresaId).subscribe(
      r => {
        this.listaResponsablesDeNegocio.data = r ? r : [];
        this.isPostingRN = false;
      },
      error => {
        this.isPostingRN = false;
      });

      //   this.empresaService.getResponsablesNegocio().subscribe(
      // r => {
      //   this.listaResponsablesDeNegocio.data = r;
      //   this.isPostingRN = false;
      // },
      // error => {
      //   this.isPostingRN = false;
      // });
  }

  compararIva(val1, val2) {
    return val1 == val2.id;
  }

  createForm() {
    this.formGroup = this.formBuilder.group({
      id: [this.empresaId],
      cuit: [null, [CustomValidators.cuit, Validators.required]],
      razonSocial: [null, [Validators.required, Validators.maxLength(100)]],
      condicionIva: this.formBuilder.group({
        id: [null, Validators.required],
        descripcion: ['']
      }),
      numeroIngresosBrutos: [null],
      actividadAfip: [null],
      estado: [null],
      calle: [null, [Validators.required, Validators.maxLength(30)]],
      numeroCalle: [null, Validators.required],
      piso: [null],
      departamento: [null, [Validators.maxLength(5)]],
      cpLocalidad: [null, [Validators.required, Validators.maxLength(8)]],
      cpArgentino: [null, [Validators.required, Validators.maxLength(8)]],
      telFijo: [null, [Validators.maxLength(15)]],
      telCelular: [null, [Validators.maxLength(15)]],
      email: [null, [Validators.email, Validators.maxLength(50)]]
    });

    this.respNegocioForm = this.formBuilder.group({
      nombre: [null, [Validators.required, Validators.maxLength(100)]],
      numeroDocumento: [null, Validators.required],
      tipoDocumento: [null],
      comentario: [null],
    });
  }

  onSubmit() {
    if (this.formGroup.invalid || this.codPostalControl.invalid) {
      this.formGroup.markAsTouched();
      this.codPostalControl.markAsTouched();
      return
    }
    if (this.formGroup.valid) {
      this.posting = true;
      this.empresaUpdate = this.formGroup.value as EmpresaDTO;
      this.empresaUpdate.id = this.empresaId;
      this.empresaUpdate.usuario = "supervisor";
      this.empresaUpdate.estado = '1';
      this.empresaUpdate.cuit = Number(this.empresaUpdate.cuit.toString().replace(/-/g, ''));
      this.empresaService.addEmpresa(this.empresaUpdate)
        .subscribe(r => {
          if (!r.length) {
            this.utilService.notification('Actualización completa!', 'success');
            this.router.navigate(['/empresa/busqueda']);

          } else {
            this.utilService.notification(r[0].detalle, (r[0].codigo == 0) ? 'success' : 'warning');
          }
        }).add(() => {
          this.posting = false;
        });
    }
  }

  InsertAt(string, CharToInsert, Position) {
    return string.slice(0, Position) + CharToInsert + string.slice(Position)
  }

  filterStates(name: string) {
    return this.actividades.filter(actividad =>
      actividad.descripcion.toLowerCase().indexOf(name.toString().toLowerCase()) === 0);
  }

  onEnter(evt: any) {
    if (evt.source.selected) {
      this.actividadCtrl.setValue(evt.source.value.descripcion);
      this.formGroup.controls['actividadAfip'].setValue(evt.source.value);
    }
  }

  codigoPostalListFill(val) {
    setTimeout(() => {
      this.contactoService.getLocalidades(val).subscribe(r => {
        this.codPostalList = r.listaResultado;
      });
    }, 400);
  }

  codigoPostalPatchValue(cod, $event?) {
    let val = cod.codigoPostal;

    this.formGroup.patchValue({
      cpLocalidad: val,
      cpArgentino: String(val)
    });
  }

  cancel() {
    if (JSON.stringify(this.formGroup.getRawValue()) !== this.empresaCopia) {
      this.dialogRef = this.utilService.openConfirmDialog({
        titulo: '',
        texto: 'Está seguro que desea descartar los datos?',
        confirmar: 'Sí',
        cancelar: 'No'
      });
      this.dialogRef.afterClosed().toPromise().then((respuesta) => {
        if (respuesta) {
          this.router.navigate(['/empresa/busqueda']);
        }
        this.dialogRef = null
      });
    } else {
      this.router.navigate(['/empresa/busqueda']);
    }
  }

  addRespNegocio() {
    if (this.respNegocioForm.invalid) {
      return
    }

    let RN: ResponsableNegocioDTO = new ResponsableNegocioDTO();
    RN.nombre = this.respNegocioForm.controls['nombre'].value;
    RN.numeroDocumento = this.respNegocioForm.controls['numeroDocumento'].value;
    RN.comentario = this.respNegocioForm.controls['comentario'].value;
    RN.tipoDocumento = "DNI";
    RN.empresaID = this.empresaId

    this.isPostingRN = true;

    this.empresaService.postResponsablesNegocio(RN).subscribe(
      resp => {
        if (resp != []) {
          this.utilService.notification('¡Responsable de negocio añadido con éxito!', 'success');
          this.respNegocioForm.reset();
          this.isPostingRN = false;
          this.getResponsablesDeNegocio();
        }
      },
      error => {
        this.isPostingRN = false;
      });

  }

  saveEditRespNegocio() {

    this.isPostingRN = true;

    let RN = this.respNegocioForm.value as ResponsableNegocioDTO;
    RN.empresaID = this.empresaId;
    RN.id = this.currentRN.id;

    this.empresaService.postResponsablesNegocio(RN).subscribe(r => {
      if (!r.length) {
        this.getResponsablesDeNegocio();
        this.respNegocioForm.reset();

        this.utilService.notification('Responsable de Negocio modificado con éxito!', 'success', 4000);
      } else {
        this.utilService.notification('Ocurrió un error', 'warning', 4000);
      }
    }).add(() => {
      this.isPostingRN = false;
      this.cancelEditRespNegocio();
    });
  }

  editRN(RN: ResponsableNegocioDTO) {
    this.isEditRN = true;
    this.currentRN = RN;
    this.respNegocioForm.patchValue(RN);
  }

  deleteRN(RN: ResponsableNegocioDTO) {
    if (this.dialogRef === null) {
      this.dialogRef = this.utilService.openConfirmDialog({
        titulo: '',
        texto: '¿Desea eliminar este Referente de Negocio?',
        confirmar: 'Eliminar',
        cancelar: 'Cancelar'
      });

      this.utilService.loseFocus();

      this.dialogRef.afterClosed().toPromise().then((respuesta) => {
        if (respuesta) {
          this.isPostingRN = true;
          this.empresaService.deleteResponsableNegocio(RN).subscribe(r => {
            if (!r.length) {
              this.getResponsablesDeNegocio();
              this.utilService.notification('¡Registro eliminado con éxito!', 'success', 4000);
            } else {
              this.utilService.notification('Ocurrió un error', 'warning', 4000);
            }
          }).add(() => {
            this.isPostingRN = false;
          });
        }

        this.dialogRef = null;
      });
    }
  }

  cancelEditRespNegocio(){
    this.currentRN = null;
    this.isEditRN = false;
    this.respNegocioForm.reset();
  }
}
