import { Component, Optional, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material';

@Component({
  selector: 'app-retrying',
  templateUrl: './retrying.component.html',
  styleUrls: ['./retrying.component.scss']
})
export class RetryingComponent {
  constructor(@Optional() @Inject(MAT_SNACK_BAR_DATA) public data: any) { }
}