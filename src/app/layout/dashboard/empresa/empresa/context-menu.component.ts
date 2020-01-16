import { Component, HostBinding, HostListener } from '@angular/core';
import { MatMenuTrigger } from '@angular/material';

@Component({
  selector: 'wm-context-menu',
  template: '<ng-content></ng-content>',
  styles: ['']
})
export class ContextMenuComponent extends MatMenuTrigger {

  @HostBinding('style.position') private position = 'fixed';
  @HostBinding('style.pointer-events') private events = 'none';
  @HostBinding('style.left') private x: string;
  @HostBinding('style.top') private y: string;

  // Intercepts the global context menu event
  //@HostListener('document:contextmenu', ['$event'])
  public open({ x, y }: MouseEvent, data?: any) {

    // Pass along the context data to support lazily-rendered content
    if(!!data) { this.menuData = data; }

    // Adjust the menu anchor position
    this.x = x + 'px';
    this.y = y + 'px';

    // Opens the menu
    this.openMenu();
    
    // prevents default
    return false;
  }
}