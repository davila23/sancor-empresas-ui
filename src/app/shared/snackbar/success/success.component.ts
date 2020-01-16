import { Component, Inject, Optional } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent {
  constructor(@Optional() @Inject(MAT_SNACK_BAR_DATA) public data: any) { }
}
