import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WrapperComponent } from './wrapper/wrapper.component';
import { MatCardModule } from '@angular/material/card';
import { SharedComponentsModule } from '@spribe/shared-components';
import { CanvasComponent } from './canvas/canvas.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
       { path: '', pathMatch: 'full', component: WrapperComponent }
    ]),
    SharedComponentsModule,
    // Material imports
    MatCardModule
  ],
  declarations: [WrapperComponent, CanvasComponent]
})
export class SlotsModule {}
