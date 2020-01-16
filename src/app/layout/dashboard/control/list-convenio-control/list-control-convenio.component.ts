import { Component, OnInit, Output, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { ControlConvenioService } from '@app/services/control/control-convenio.service';
import { MatTableDataSource, MatPaginator } from '@angular/material';

@Component({
    selector: 'app-control-convenio',
    templateUrl: './list-control-convenio.component.html',
    styleUrls: ['./list-control-convenio.component.scss']
  })
export class ListControlConvenioComponent implements OnInit {

    constructor(private controlConvenioService: ControlConvenioService){

    }
     
    


    ngOnInit() {
        this.controlConvenioService.obtenerListaControlConvenio().subscribe(
            res =>{
                console.log(res);
                this.convenioControlDataSource.data = res;
            } 
        )
    }

    listaControl_displayedColumns = [
    'nombreConvenio',
    'nombreEmpresa',
    'usuario',
    'fecha',
    'estado',
    'acciones'
    ];

    convenioControlDataSource = new MatTableDataSource<any>([]);

    private paginator: MatPaginator;

	@ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
		this.paginator = mp;
		this.convenioControlDataSource.paginator = this.paginator;
	}

}
