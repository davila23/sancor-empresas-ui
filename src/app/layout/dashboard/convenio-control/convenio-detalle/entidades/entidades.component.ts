import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { EntidadesService } from '@app/services/empresa/convenios/alta-wizard/componentes/entidades.service';
import { DatosGeneralesService } from '@app/services/empresa/convenios/alta-wizard/componentes/datos-generales.service';

@Component({
  selector: 'entidades-control',
  templateUrl: './entidades.component.html',
  styleUrls: ['./entidades.component.scss']
})
export class EntidadesComponent implements OnInit {
	
	constructor(private entidadesService: EntidadesService,
              private dgs: DatosGeneralesService) { }

	@Input() set convenioId(convenioId) {
	  setTimeout(() => {
      this.convenioIdFlag = convenioId;
      this.fillEntidades();
	  });
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.entidadDataSource.paginator = this.paginator;
  }; private paginator: MatPaginator;

  convenioIdFlag = null;
  
  entidadDataSource = new MatTableDataSource<any>([]);


  fillEntidades() {
    this.entidadesService.getEntidadesRelacionadas(this.convenioIdFlag).subscribe(res => {
      if (res == null) res = [];

      this.entidadDataSource.data = res;
    });
  }

  entidad_displayedColumns = [
    'nro_empresa',
    'cuit',
    'descripcion'
  ];

	ngOnInit() {

	}

}
