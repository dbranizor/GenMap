import { ElementRef } from '@angular/core';

export interface APSMapWidget {
  add(ele: ElementRef, options: any);
  remove(name: string);
}
