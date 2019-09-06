import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapViewComponent } from './map-view/map-view.component';
import { MapControlsComponent } from './map-controls/map-controls.component';

@NgModule({
  declarations: [MapViewComponent, MapControlsComponent],
  imports: [
    CommonModule,
  ],
  exports: [MapViewComponent]
})
export class LeafletModule { }
