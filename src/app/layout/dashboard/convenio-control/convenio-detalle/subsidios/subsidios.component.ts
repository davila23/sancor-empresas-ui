import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { SubsidiosService } from '@app/services/empresa/convenios/alta-wizard/componentes/subsidios.service';

@Component({
  selector: 'subsidios-control',
  templateUrl: './subsidios.component.html',
  styleUrls: ['./subsidios.component.scss']
})
export class SubsidiosComponent implements OnInit {
	constructor(private subsidiosService: SubsidiosService) { }


	@Input() set convenioId(convenioId) {
    this.convenioIdFlag = convenioId;
    this.fillSubsidios();
	}; private convenioIdFlag;

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.subsidiosDataSource.paginator = this.paginator;
  }; private paginator: MatPaginator;

  subsidiosDataSource = new MatTableDataSource<any>([]);

	subsidios_displayedColumns = [
		'producto',
		'plan'
	];

  fillSubsidios() {
    this.subsidiosService.getSubsidiosPorEmpresa(this.convenioIdFlag).subscribe(res =>{
      if (res == null) res = [];

      this.subsidiosDataSource.data = res;
    });
  }

	ngOnInit(): void { }
}
