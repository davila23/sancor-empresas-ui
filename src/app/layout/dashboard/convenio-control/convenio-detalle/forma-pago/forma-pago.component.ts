import { Component, OnInit, Input } from '@angular/core';
import { FormaDePagoConvenioDTO } from '@app/models/forma-de-pago.model';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { FormasDePagoService } from '@app/services/empresa/convenios/alta-wizard/componentes/formas-de-pago.service';
import { DetalleFormaPagoModalComponent } from './detalle-forma-pago-modal/detalle-forma-pago-modal.component';

@Component({
  selector: 'forma-pago-control',
  templateUrl: './forma-pago.component.html',
  styleUrls: ['./forma-pago.component.scss']
})
export class FormaPagoComponent implements OnInit {

	constructor(
		private dialog: MatDialog,
		private formaPagoService: FormasDePagoService) { }
    
    
  @Input() set convenioId(convenioId) {
    this.convenioIdFlag = convenioId;		
    this.fillFormaPago();
  }; private convenioIdFlag = null;
  
  formaDePagoSelected:string;
  
  formasDePago: any = [];
  
  formaPagoDataSource = new MatTableDataSource<any>([]);
	
  
	formaPago_displayedColumns = [
    'formaPago',
		'detalle'
	];
  
  formasDePagoList:FormaDePagoConvenioDTO[];
  
  tipo: string;

  fillFormaPago() {
    this.formaPagoService.getFormasDePagoEmpresas(this.convenioIdFlag).subscribe(res => {
      if (res == null) res = [];
      this.formasDePagoList = res;
      this.formaPagoDataSource.data = res;	
      if (res[0]) this.formaDePagoSelected = res[0].descripcion;
    })
  }
  
  
	openFormaPagoModal(data) {
    this.formaPagoService.getFormaDePagodetalle(this.convenioIdFlag,data.descripcion).subscribe(res => {
      let dataFields = {};
  
      if (data.descripcion.trim() ==='TC') {
        this.tipo = 'tc';
        dataFields = {tc:res};
      } else {
        this.tipo = 'cbu';
        dataFields = {cbu:res};
      }

      const modal = this.dialog.open(DetalleFormaPagoModalComponent, {
        disableClose: true,
        panelClass: 'responsive-modal',
        data: {
          type: this.tipo,
          dataFields	
        }
      });
    });
  }
  
  ngOnInit() { }
}
