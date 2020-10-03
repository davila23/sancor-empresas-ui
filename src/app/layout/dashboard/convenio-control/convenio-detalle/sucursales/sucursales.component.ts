import { Component, ViewChild, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { SucursalesService } from '@app/services/empresa/convenios/alta-wizard/componentes/sucursales.service';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { Subscription, Observable} from 'rxjs';

@Component({
	selector: 'sucursales-control',
	templateUrl: './sucursales.component.html',
	styleUrls: ['./sucursales.component.scss']
})
export class SucursalesComponent {

	sucursalServiceSubject: Subscription;
	localidadCtrl = new FormControl();
	filteredLocalidades: Observable<any[]>;
	sucursalesForm: FormGroup;
	isEditionFlag = false;
	empresaIdFlag = null;
	convenioIdFlag = null;

	constructor(private sucursalService: SucursalesService) {

	}

	@Input() set convenioId(convenioId) {
		setTimeout(() => {
			this.convenioIdFlag = convenioId;
			this.fillSucursales();
		});
	}

	fillSucursales() {

    this.sucursalService.getSucursalesEmpresa(this.convenioIdFlag)
    .subscribe(res => {
      if (res == null) res = [];

      this.sucursalDataSource.data = res;
    })
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
		this.paginator = mp;
		this.sucursalDataSource.paginator = this.paginator;
	} private paginator: MatPaginator;

  sucursalDataSource = new MatTableDataSource<any>([]);

  sucursal_displayedColumns = [
    'descripcion',
    'domicilio',
    'telefono',
    'email',
    'localidad'
  ];

}
