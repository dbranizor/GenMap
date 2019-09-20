import { ElementRef } from '@angular/core';

export interface AMSMapWidget {
  /**
   * Adds a map widget container
   * @param  {ElementRef} ele -- Angular specific element reference
   * @param  {any} options -- Key value pairs of configuration options (position of widget, etc)
   */
  add(ele: ElementRef, options: any);
  /**
   * @param  {string} name -- Name of widget to remove
   */
  remove(name: string);
}
