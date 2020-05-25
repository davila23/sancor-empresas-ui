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
	selector: 'app-sucursales',
	templateUrl: './sucursales.component.html',
	styleUrls: ['./sucursales.component.scss']
})
export class SucursalesComponent implements OnInit {

	sucursalServiceSubject: Subscription;
	localidadCtrl = new FormControl();
	filteredLocalidades: Observable<any[]>;
	sucursalesForm: FormGroup;
	isEditionFlag = false;
	empresaIdFlag = null;
  convenioIdFlag = null;
  dialogRef = null;

  codPostalControl = new FormControl();
  codPostalList: any = [];


  constructor(private _fb: FormBuilder,
              private service: ContactoService,
              private sucursalService: SucursalesService,
              private utilService: UtilService) {
	}

	
	ngOnInit() {

		this.sucursalesForm = this._fb.group({
			descripcion: ['', [Validators.required]],
			domicilio: [''],
      telefono: [''],
      categoria: [''],
			email: ['', [Validators.email]],
			localidad: this._fb.group({
				codigoPostal: ['', [Validators.required]],
				detalle: [''],
				subCodigoPostal: [''],
				codigoPostalReal: [''],
				provincia: [''],
			}),
		});
	}

  fillSucursales() {
    this.sucursalService.getSucursalesEmpresa(this.convenioIdFlag)
    .subscribe(res => {
      if (res == null) res = [];

      this.sucursalDataSource.data = res;
    })
  }

  codigoPostalListFill(val) {
    setTimeout(() => {
      this.sucursalService.getLocalidades(val).subscribe(r => {
        this.codPostalList = r.listaResultado;
     });
    }, 400);
  }

  localidadPatchValue(item) {
    this.sucursalesForm.patchValue({
      localidad: item
    });
  }


  sucursalItem: SucursalEmpresaDTO;

	private paginator: MatPaginator;

	@ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
		this.paginator = mp;
		this.sucursalDataSource.paginator = this.paginator;
	}

	//sucursal_list: any = [];
	sucursal_displayedColumns = [
		'descripcion',
		'domicilio',
		//'categoria',
		'telefono',
		'email',
		'localidad',
		'delete'
	];

	sucursalDataSource = new MatTableDataSource<any>([]);

	sucursalSaveAndRender() {
		if (this.sucursalesForm.valid) {

      this.isPosting = true;

			this.sucursalItem = this.sucursalesForm.value as SucursalEmpresaDTO;
			this.sucursalItem.empresaId = this.convenioIdFlag;
			this.sucursalItem.estado = 0;
		
      this.sucursalService.addSucursalEmpresa(this.sucursalItem)
      .subscribe(res => {
        this.utilService.notification('¡Sucursal agregada!', 'success');
			  this.fillSucursales();
      }).add(() => {
        this.isPosting = false;
      });
		}

    this.sucursalesForm
    .reset({ descripcion: '', domicilio: '', categoria: '', telefono: '', email: '', localidad: '' });

    this.localidadCtrl.setValue('');
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

          this.sucursalService.deleteSucursarEmpresa(sucursalItem)
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

  isPosting = false;

	@Input() set isEdition(isEdition) {
		setTimeout(() => {
			this.isEditionFlag = isEdition;
		});
	}

	@Input() set empresaId(empresaId) {
		setTimeout(() => {
			this.empresaIdFlag = empresaId;
		});
	}

  @Input() set isAllowedToEdit(boolean) {
    setTimeout( () => {
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
      this.fillSucursales();
		});
	}
} 