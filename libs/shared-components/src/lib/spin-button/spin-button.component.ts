import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'spribe-spin-button',
  template: `
    <div class="spin-button" (click)="handleClick.emit()"
         [style.height]="(height || 75) + 'px'"
         [style.lineHeight]="(height || 75) + 'px'"
         [style.backgroundColor]="color || 'black'">
      <span>{{this.label || 'Spin the wheels!'}}</span>
    </div>`,
  styles: [`
    .spin-button {
      text-align: center;
      cursor: pointer;
      user-select: none;
    }
    span {
      font-style: italic;
      font-weight: bold;
      font-size: 36px;
      background: linear-gradient(to bottom, #ffffff 23px, #00ff99);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      color: #0B2349;
      display: inline-block;
      padding: 0 20px;
    }
  `]
})
export class SpinButtonComponent {

  @Input('label') label: string;
  @Input('color') color: string;
  @Input('height') height: number;
  @Output('handleClick') handleClick = new EventEmitter<void>();

}
