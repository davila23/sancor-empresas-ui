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
      domicilio: [''],
      categoria: [''],
      telefono: [''],
      email: [''],
      localidad: this._fb.group({
        codigoPostal: [''],
        detalle: [''],
        subCodigoPostal: [''],
        codigoPostalReal: [''],
        provincia: [''],
      }),
    });
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
		this.paginator = mp;
		this.sucursalDataSource.paginator = this.paginator;
	} private paginator: MatPaginator;

  @Input() set isEdition(isEdition) {
		setTimeout(() => {
			this.isEditionFlag = isEdition;
		});
	} isEditionFlag = false;

	@Input() set empresaId(empresaId) {
		setTimeout(() => {
			this.empresaIdFlag = empresaId;
		});
	} empresaIdFlag = null;

	@Input() set convenioId(convenioId) {
		setTimeout(() => {
      this.convenioIdFlag = convenioId;		
		});
	} convenioIdFlag = null;
  
  sucursalServiceSubject: Subscription;
	localidadCtrl = new FormControl();
	filteredLocalidades: Observable<any[]>;
	sucursalesForm: FormGroup;
  
  dialogRef = null;
  isPosting = false;

  codPostalControl = new FormControl();
  codPostalList: any = [];

  sucursalItem: SucursalEmpresaDTO;

  sucursalDataSource = new MatTableDataSource<any>([]);
  //sucursal_list: any = [];
	sucursal_displayedColumns = [
		'descripcion',
		'domicilio',
		'categoria',
		'telefono',
		'email',
		'localidad',
		'delete'
	];

  fillSucursales() {
    this.sucursalService.getSucursalesEmpresaD(this.empresaIdFlag)
    .subscribe(res => {
      if (res == null) res = [];  
      this.sucursalDataSource.data = res
    });
  }

	ngOnInit() { }

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
		if (this.sucursalesForm.valid) {

      this.isPosting = true;

			this.sucursalItem = this.sucursalesForm.value as SucursalEmpresaDTO;
			this.sucursalItem.empresaId = this.convenioIdFlag;
			this.sucursalItem.estado = 0;
		
      this.sucursalService.addSucursalEmpresaD(this.sucursalItem)
      .subscribe(res => {
			  this.fillSucursales();
      }).add(() => {
        this.isPosting = false;
      });
		}

    this.sucursalesForm
    .reset({ descripcion: '', domicilio: '', categoria: '', telefono: '', email: '', localidad: '' });
	}

	sucursalDelete(sucursalItem: SucursalEmpresaDTO) {
    if (this.dialogRef === null) {
			this.dialogRef = this.utilService.openConfirmDialog({
				titulo: 'Dialogo de confirmación',
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