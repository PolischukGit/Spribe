import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      {
        path: 'slots',
        data: { title: 'SLOTS' },
        loadChildren: () =>
          import('@spribe/slots').then((module) => module.SlotsModule),
      },
      {
        path: '',
        redirectTo: 'slots',
        pathMatch: 'full'
      },
      {
        path: '**',
        redirectTo: 'slots',
        pathMatch: 'full'
      }
    ]),
    BrowserAnimationsModule,
    // Material imports
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
