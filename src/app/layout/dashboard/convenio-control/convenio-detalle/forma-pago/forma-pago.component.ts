import { Component, OnInit, Input } from '@angular/core';
import { FormaDePagoConvenioDTO } from '@app/models/forma-de-pago.model';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { FormasDePagoService } from '@app/services/empresa/convenios/alta-wizard/componentes/formas-de-pago.service';
import { DetalleFormaPagoModalComponent } from '@app/shared/detalle-forma-pago-modal/detalle-forma-pago-modal.component';
import { UtilService } from '@app/core';


@Component({
  selector: 'forma-pago-control',
  templateUrl: './forma-pago.component.html',
  styleUrls: ['./forma-pago.component.scss']
})
export class FormaPagoComponent implements OnInit {

  dialogRef = null;

	constructor(
		private dialog: MatDialog,
    private formaPagoService: FormasDePagoService,
    private utilService: UtilService) { }
    
    
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
	
    this.formaPagoService.getFormaDePagodetalle(this.convenioIdFlag,data.descripcion)
    .subscribe(res=> {

      if (res) {

      console.log('data', data);
      console.log('res', res);

      let tipo = 'EF';

      if (data.descripcion.trim() == 'TC') tipo = 'TC';  
      else if (data.descripcion.trim() == 'CBU') tipo = 'CBU';
      
      let parsedData = {
        tipo: tipo,
        datos: {
          
        }
      };

      switch(tipo) {
        case 'TC':
          parsedData.datos = {
            bancoId: res.codigoTarjeta,
            descripcion: res.descripcion,
            numeroTarjeta: res.numeroTarjeta,
            bancoDesc: ''
          }
          break;
        case 'CBU':
          parsedData.datos = {
            nombre: res.nombre,
            apellido: res.apellido,
            descripcion: res.descripcion,
            cbu: res.nroCbu,
            cuenta: res.numeroCuenta,
            tipoCuenta: res.tipoCuentaString,
            bancoId: res.banco,
            bancoDesc: ''
          }
          break;
        case 'EF':
          parsedData.datos = {
            descripcion: 'EFECTIVO'
          }
          break;
      }

      const modal = this.dialog.open(DetalleFormaPagoModalComponent, {
        disableClose: true,
        panelClass: 'responsive-modal',
        data: parsedData
      });
    } else{
      this.dialogRef = this.utilService.openConfirmDialog({
        titulo: 'Error',
        texto: 'No se pudieron obtener los datos',
        confirmar: 'Aceptar',
        cancelar: ''
      });
      this.dialogRef.afterClosed().toPromise().then((respuesta) => {this.dialogRef = null});
    }
    });
	}
  
  ngOnInit() { }
}
