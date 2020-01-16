import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsuarioDTO } from '@app/models/empresa/usuario-model';
import { EmpresaService } from '@app/services/empresa/empresa.service';
import { EmpresaDTO } from '@app/models/empresa/empresa.model';


@Component({
  selector: 'app-search-empresa',
  templateUrl: './search-empresa.component.html',
  styleUrls: ['./search-empresa.component.scss']
})
export class SearchEmpresaComponent implements OnInit {

  usuario: UsuarioDTO;
  @Output() dataSource: EventEmitter<EmpresaDTO[]> =   new EventEmitter();

  constructor(private empresaService: EmpresaService) { }

  ngOnInit() {
  }

  onSubmit(f: NgForm) {
	 this.empresaService.searchEmpresas(f.value.nombreEmpresa).subscribe( (res)=>{
      this.dataSource.emit(res);
	 });
  }
}
