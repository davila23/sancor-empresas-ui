import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { VipService } from '@app/services/empresa/convenios/alta-wizard/componentes/vip.service';
import { MatPaginator, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'vip-control',
  templateUrl: './vip.component.html',
  styleUrls: ['./vip.component.scss']
})
export class VipComponent implements OnInit {

  constructor(private service: VipService) { }

  @Input() set convenioId(convenioId) {
    this.convenioIdFlag = convenioId;

    this.fillUsuarios();
  }; private convenioIdFlag;

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.vipDataSource.paginator = this.paginator;
  }; private paginator: MatPaginator;

  vipForm;

  vipDataSource = new MatTableDataSource<any>([]);
  vip_displayedColumns = [
    'dni'
  ];


  fillUsuarios() {
    this.service.getUsuariosVip(this.convenioIdFlag).subscribe(r => {
      this.vipDataSource.data = (r) ? r : [];
    });
  }

  ngOnInit() { }

}
