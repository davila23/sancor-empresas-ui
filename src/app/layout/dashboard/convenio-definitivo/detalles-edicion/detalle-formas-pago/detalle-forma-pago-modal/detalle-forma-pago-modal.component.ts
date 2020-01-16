import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-detalle-forma-pago-modal',
  templateUrl: './detalle-forma-pago-modal.component.html',
  styleUrls: ['./detalle-forma-pago-modal.component.scss']
})
export class DetalleFormaPagoModalComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<DetalleFormaPagoModalComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() { }

  close() {
    this.dialogRef.close();
  }

}
