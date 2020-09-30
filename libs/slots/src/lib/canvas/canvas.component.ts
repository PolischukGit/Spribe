import { Component, ElementRef, HostBinding, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { PixiFunctionality } from '@spribe/pixi-functionality';
import { SlotService } from '../slot-service.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'spribe-canvas',
  template: '',
  styles: []
})
export class CanvasComponent extends PixiFunctionality implements OnDestroy {

  @HostBinding('style.display') display = 'flex';

  private running = false;
  private alive$ = new Subject<void>();

  constructor(private ngZone: NgZone, private service: SlotService, private el: ElementRef) {
    super();
    this.ngZone.runOutsideAngular(() => {
      this.app = this.createApplication({
        backgroundColor: 0x1099bb,
        height: 525
      });
    });
    this.el.nativeElement.appendChild(this.app.view);
    this.app.loader
      .add('../../assets/eggHead.png', '../../assets/eggHead.png')
      .add('../../assets/flowerTop.png', '../../assets/flowerTop.png')
      .add('../../assets/helmlok.png', '../../assets/helmlok.png')
      .add('../../assets/skully.png', '../../assets/skully.png')
      .load(this.onAssetsLoaded.bind(this));
    this.app.ticker.add((delta) => {
      const now = Date.now();
      const remove = [];
      for (let i = 0; i < this.tweening.length; i++) {
        const t = this.tweening[i];
        const phase = Math.min(1, (now - t.start) / t.time);
        t.object[t.property] = this.lerp(t.propertyBeginValue, t.target, t.easing(phase));
        if (t.change) t.change(t);
        if (phase === 1) {
          t.object[t.property] = t.target;
          if (t.complete) t.complete(t);
          remove.push(t);
        }
      }
      for (let i = 0; i < remove.length; i++) {
        this.tweening.splice(this.tweening.indexOf(remove[i]), 1);
      }
    });
  }

  private onAssetsLoaded(): void {
    const slotTextures = [
      PIXI.Texture.from('../../assets/eggHead.png'),
      PIXI.Texture.from('../../assets/flowerTop.png'),
      PIXI.Texture.from('../../assets/helmlok.png'),
      PIXI.Texture.from('../../assets/skully.png')
    ];
    const reels = [];
    const reelContainer = this.createContainer();
    for (let i = 0; i < 5; i++) {
      const rc = this.createContainer();
      rc.x = i * this.service.REEL_WIDTH;
      reelContainer.addChild(rc);
      const reel = {
        container: rc,
        symbols: [],
        position: 0,
        previousPosition: 0,
        blur: this.createFilter('BlurFilter')
      };
      reel.blur.blurX = 0;
      reel.blur.blurY = 0;
      rc.filters = [reel.blur];
      for (let j = 0; j < 4; j++) {
        const symbol = this.createSprite(slotTextures[Math.floor(Math.random() * slotTextures.length)]);
        symbol.y = j * this.service.SYMBOL_SIZE;
        symbol.scale.x = symbol.scale.y = Math.min(this.service.SYMBOL_SIZE / symbol.width, this.service.SYMBOL_SIZE / symbol.height);
        symbol.x = Math.round((this.service.SYMBOL_SIZE - symbol.width) / 2);
        reel.symbols.push(symbol);
        rc.addChild(symbol);
      }
      reels.push(reel);
    }
    this.app.stage.addChild(reelContainer);
    const margin = (this.app.screen.height - this.service.SYMBOL_SIZE * 3);
    reelContainer.y = margin;
    reelContainer.x = Math.round(this.app.screen.width - this.service.REEL_WIDTH * 5);
    const top = this.createGraphics();
    top.beginFill(0, 1);
    top.drawRect(0, 0, this.app.screen.width, margin);
    const style = this.createTextStyle(this.service.textStyle);
    const headerText = this.createText('PIXI MONSTER SLOTS!', style);
    headerText.x = Math.round((top.width - headerText.width) / 2);
    headerText.y = Math.round((margin - headerText.height) / 2);
    top.addChild(headerText);
    this.app.stage.addChild(top);
    const startPlay = (): void => {
      if (this.running) return;
      this.running = true;
      for (let i = 0; i < reels.length; i++) {
        const r = reels[i];
        const extra = Math.floor(Math.random() * 3);
        const target = r.position + 10 + i * 5 + extra;
        const time = 2500 + i * 600 + extra * 600;
        this.tweenTo(r, 'position', target, time, this.backout(0.5), null, i === reels.length - 1 ? reelsComplete : null);
      }
    }
    const reelsComplete = (): void => {
      this.running = false;
    }
    this.app.ticker.add((delta) => {
      for (let i = 0; i < reels.length; i++) {
        const r = reels[i];
        r.blur.blurY = (r.position - r.previousPosition) * 8;
        r.previousPosition = r.position;
        for (let j = 0; j < r.symbols.length; j++) {
          const s = r.symbols[j];
          const prevy = s.y;
          s.y = ((r.position + j) % r.symbols.length) * this.service.SYMBOL_SIZE - this.service.SYMBOL_SIZE;
          if (s.y < 0 && prevy > this.service.SYMBOL_SIZE) {
            s.texture = slotTextures[Math.floor(Math.random() * slotTextures.length)];
            s.scale.x = s.scale.y = Math.min(this.service.SYMBOL_SIZE / s.texture.width, this.service.SYMBOL_SIZE / s.texture.height);
            s.x = Math.round((this.service.SYMBOL_SIZE - s.width) / 2);
          }
        }
      }
    });
    this.service.launcher$.pipe(
      takeUntil(this.alive$)
    ).subscribe(() => startPlay());
  }

  ngOnDestroy() {
    this.alive$.next();
    this.alive$.complete();
  }

}
