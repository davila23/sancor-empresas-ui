import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { GrillaEmpresaService } from '@app/services/empresa/convenios/alta-wizard/componentes/grilla-empresa.service';

@Component({
  selector: 'grillas-control',
  templateUrl: './grillas.component.html',
  styleUrls: ['./grillas.component.scss']
})
export class GrillasComponent implements OnInit {

  isPosting: boolean = false;

  constructor(private grillaEmpresaService: GrillaEmpresaService) { }

  @Input() set convenioId(convenioId) {
    this.convenioIdFlag = convenioId;
    this.fillGrilla();
  }; private convenioIdFlag = null;

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.grillasProductoDataSource.paginator = this.paginator;
  }; private paginator: MatPaginator;

  grillasProductoDataSource = new MatTableDataSource<any>([]);

  grillasProducto_displayedColumns = [
    'idGrilla',
    'grilla'
  ];

  fillGrilla() {
    this.isPosting = true;
    this.grillaEmpresaService.getAllGrillas(this.convenioIdFlag).subscribe(
      res => {
        if (res == null) res = [];

        this.grillasProductoDataSource.data = res;
        this.isPosting = false;
      },
      error => {
        this.isPosting = false;
      });
  }


  ngOnInit() { }
}
