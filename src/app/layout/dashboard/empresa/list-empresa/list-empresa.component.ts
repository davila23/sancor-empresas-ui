import { Component, OnInit, Input } from '@angular/core';
import { EmpresaDTO } from '@app/models/empresa/empresa.model';

@Component({
  selector: 'app-list-empresa',
  templateUrl: './list-empresa.component.html',
  styleUrls: ['./list-empresa.component.scss']
})
export class ListEmpresaComponent implements OnInit {

  @Input() dataSource: EmpresaDTO[];

  displayedColumns:  string[] = ['cuit', 'razonSocial', 'nombreFantasia', 'numeroEmpresa', 'actions'];

  constructor() { }

  ngOnInit() {
  }

}
