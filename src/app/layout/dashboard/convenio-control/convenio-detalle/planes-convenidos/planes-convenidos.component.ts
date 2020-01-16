import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { CabeceraConvenioDTO } from '@app/models/cabecera-convenio.model';
import { PlanesConvenidosService } from '@app/services/empresa/convenios/alta-wizard/componentes/planes-convenidos.service';

@Component({
  selector: 'planes-convenidos-control',
  templateUrl: './planes-convenidos.component.html',
  styleUrls: ['./planes-convenidos.component.scss']
})
export class PlanesConvenidosComponent implements OnInit {

	constructor(private planesConvenidosService: PlanesConvenidosService) { }

  @Input() set convenioId(convenioId) {	
    this.convenioIdFlag = convenioId;
    this.fillPlanesConvenidos();
	}; private convenioIdFlag = null;

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.cabeceraDataSource.paginator = this.paginator;
  }; private paginator: MatPaginator;

  cabeceraDataSource = new MatTableDataSource<any>([]);
  cabeceraConvenio: CabeceraConvenioDTO;

	cabeceraDisplayedColumns = [
    'planDescripcion',
		'producto'
	];

  fillPlanesConvenidos() {
    this.planesConvenidosService.getCabeceraConvenio(this.convenioIdFlag).subscribe(res => {
      if (res != null && res[0]) {
        this.cabeceraConvenio = res[0];
        this.planesConvenidosService.getPlanesConvenidos(res[0].id).subscribe(res => {
          if(res==null) res = [];

          this.cabeceraDataSource.data = res;
        });
      }
    });
  }
  
  ngOnInit(): void { }

}
