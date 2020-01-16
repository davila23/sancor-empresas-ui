import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'detalle-forma-pago-modal-control',
  templateUrl: './detalle-forma-pago-modal.component.html',
  styleUrls: ['./detalle-forma-pago-modal.component.scss']
})
export class DetalleFormaPagoModalComponent {

  constructor(private dialogRef: MatDialogRef<DetalleFormaPagoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  close() {
    this.dialogRef.close();
  }
}
