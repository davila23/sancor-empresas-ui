import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ReferenteEmpresaService } from '@app/services/empresa/convenios/alta-wizard/componentes/referente-empresa.service';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { ReferenteEmpresaDTO } from '@app/models/referente-empresa.model';

@Component({
  selector: 'referentes-control',
  templateUrl: './referentes.component.html',
  styleUrls: ['./referentes.component.scss']
})
export class ReferentesComponent implements OnInit {

  constructor(private _service: ReferenteEmpresaService) { }

  @Input() set convenioId (convenioId) {
    this.convenioIdFlag = convenioId;
    this.fillTable();
  }; private convenioIdFlag; 

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
      this.paginator = mp;
      this.referenteDataSource.paginator = this.paginator;
  }; private paginator: MatPaginator;

  // start Referente
  referente_list: ReferenteEmpresaDTO[] = [];
  referente_displayedColumns = [
      'nombreApellido',
      'fechaNacimiento',
      'numeroDocumento',
      'numeroTelefono',
      'email'
  ];

  referenteDataSource = new MatTableDataSource<ReferenteEmpresaDTO>([]);

  fillTable() {
    this._service.getReferentes(this.convenioIdFlag).
    subscribe(r => {
      this.referenteDataSource.data = (r) ? r : [];
    });
  }

  ngOnInit() {
  }

}
