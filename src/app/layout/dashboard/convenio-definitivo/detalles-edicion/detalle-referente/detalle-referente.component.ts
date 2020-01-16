import { Component, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { ReferenteEmpresaService } from '@app/services/empresa/convenios/alta-wizard/componentes/referente-empresa.service';
import { ReferenteEmpresaDTO } from '@app/models/referente-empresa.model';
import { UtilService } from '@app/core';

@Component({
  selector: 'detalle-referente',
  templateUrl: './detalle-referente.component.html',
	styleUrls: ['./detalle-referente.component.scss']
})
export class DetalleReferenteComponent implements OnInit {

  constructor(private _fb: FormBuilder, 
              private _service: ReferenteEmpresaService, 
              private utilService: UtilService)
  {
    this.referenteForm = this._fb.group({
      empresaId: ['', Validators.required],
      id: [null],
      nombreApellido: ['', [Validators.required]],
      cargo: [''],
      fechaNacimiento: ['', [Validators.required]],
      tipoDocumento: [96],
      numeroDocumento: [],
      caracteristicaTelefono: [''],
      numeroTelefono: [''],
      numeroCelular: [''],
      estado: [0],
      email: ['', [Validators.required, Validators.email]],
      hobbie: [''],
      deporte: ['']
    });

    this.telefonoForm = this._fb.group({
      caracteristica: ['', Validators.required],
      numero: ['', Validators.required]
    });
  }

  @Input() set convenioId (convenioId) {
    this.referenteForm.patchValue({empresaId: Number(convenioId)});
  };

  @Input() set isEdition(isEdition) {
		setTimeout(() => {
			this.isEditionFlag = isEdition;
		});
	}

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.referenteDataSource.paginator = this.paginator;
  }

  private paginator: MatPaginator;

  isEditionFlag;

  referenteForm: FormGroup;
  telefonoForm: FormGroup;
  // start Referente
  referente_list: ReferenteEmpresaDTO[] = [];
  referente_displayedColumns = [
    'nombreApellido',
    'fechaNacimiento',
    'numeroDocumento',
    'numeroTelefono',
    'email',
    'delete'
  ];

  referenteDataSource = new MatTableDataSource<ReferenteEmpresaDTO>([]);

  isPosting = false;

  dialogRef = null;

  fillTable() {
    this._service.getReferentesD(this.referenteForm.value.empresaId).subscribe(r => {
      this.referenteDataSource.data = (r) ? r : [];
    });
  }

  referenteSaveAndRender() {
    if (this.dialogRef === null) {
      this.dialogRef = this.utilService.openConfirmDialog({
        titulo: 'Dialogo de confirmación',
        texto: '¿Desea añadir el registro de referente?',
        confirmar: 'Añadir',
        cancelar: 'Cancelar'
      });

      this.utilService.loseFocus();
      
      this.dialogRef.afterClosed().toPromise().then((respuesta) => {
        
        if (respuesta) {

          this.isPosting = true;

          this._service.addReferenteD(this.referenteForm.value).subscribe(r => {
            this.utilService.notification('¡Referente añadido con éxito!', 'success', 4000);
            this.fillTable();
          }).add(() => {
            this.isPosting = false;
          });
    
          this.referenteForm.patchValue({
            nombreApellido: '',
            cargo: '',
            fechaNacimiento: '',
            tipoDocumento: 96,
            numeroDocumento: '',
            caracteristicaTelefono: '',
            numeroTelefono: '',
            numeroCelular: '',
            estado:1,
            email: '',
            hobbie: '',
            deporte: ''
          });
    
          this.telefonoForm.reset({
            caracteristica: '',
            numero: ''
          });
    
          this.referenteForm.markAsPristine();
          this.referenteForm.markAsUntouched();
          this.telefonoForm.markAsPristine();
          this.telefonoForm.markAsUntouched();           
        }

        this.dialogRef = null;
      });
    }
  }

  referenteDelete(row) {
    if (this.dialogRef === null) {
      this.dialogRef = this.utilService.openConfirmDialog({
        titulo: 'Dialogo de confirmación',
        texto: '¿Desea eliminar el registro de referente?',
        confirmar: 'Eliminar',
        cancelar: 'Cancelar'
      });

      this.utilService.loseFocus();
      
      this.dialogRef.afterClosed().toPromise().then((respuesta) => {
        
        if (respuesta) {

          this.isPosting = true;

          this._service.deleteReferenteD({
            empresaId: row.empresaId,
            id: row.id
          }).subscribe(r => {
            this.utilService.notification('Registro eliminado con éxito.', 'success', 4000);
            this.fillTable();
          }).add(() => {
            this.isPosting = false;
          });     
        }

        this.dialogRef = null;
      });
    }
  }

  patchDate(date) {
    this.referenteForm.patchValue({fecha_nacimiento: date.modeloValue});
  }

  ngOnInit(): void {
    this.fillTable();

    this.referenteForm.valueChanges.subscribe(r => {
      r.fechaNacimiento = (r.fechaNacimiento) ? r.fechaNacimiento.format('YYYY-MM-DD') : null;
    });

    this.telefonoForm.valueChanges.subscribe(r => {
      this.referenteForm.patchValue({
          caracteristicaTelefono: r.caracteristica,
          numeroTelefono: r.numero
      });
    });
  }
}
