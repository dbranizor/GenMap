import { ElementRef } from '@angular/core';

export interface AMSMapWidget {
  add(ele: ElementRef, options: any);
  remove(name: string);
}
