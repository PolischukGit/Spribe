import { Component } from '@angular/core';
import { SlotService } from '../slot-service.service';

@Component({
  selector: 'spribe-wrapper',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.scss']
})
export class WrapperComponent {

  constructor(private service: SlotService) {
  }

  clickEvent(): void {
    this.service.launcher$.next();
  }

}
