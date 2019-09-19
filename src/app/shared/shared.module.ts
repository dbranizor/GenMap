import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapService } from './services/map.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [MapService]
})
export class SharedModule { }
