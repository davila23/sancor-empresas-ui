import { Component, Inject, Optional } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef, SimpleSnackBar } from '@angular/material';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent {
  constructor(@Optional() @Inject(MAT_SNACK_BAR_DATA) public data: any) { }
}
