import { Application, Container, Texture, Sprite, Graphics, TextStyle, Text } from 'pixi.js';

export class PixiFunctionality {

  app: Application;
  tweening = [];

  createApplication(options = {}): Application {
    return new PIXI.Application(options);
  }

  createContainer(): Container {
    return new PIXI.Container();
  }

  createFilter(filterClassName: string): any {
    return new PIXI.filters[filterClassName]();
  }

  createSprite(item: Texture): Sprite {
    return new PIXI.Sprite(item);
  }

  createGraphics(): Graphics {
    return new PIXI.Graphics();
  }

  createTextStyle(options = {}): TextStyle {
    return new PIXI.TextStyle(options);
  }

  createText(value: string, style: any): Text {
    return new PIXI.Text(value || 'text', style || {});
  }

  createTextures(items: string | string[]): Texture[] {
    const textures = [];
    const arr = this.checkAndCreateArray(items);
    arr.forEach(item => {
      textures.push(PIXI.Texture.from(item));
    });
    return textures;
  }

  tweenTo(object, property, target, time, easing, onchange, oncomplete): {[key: string]: any} {
    const tween = {
      object,
      property,
      propertyBeginValue: object[property],
      target,
      easing,
      time,
      change: onchange,
      complete: oncomplete,
      start: Date.now(),
    };
    this.tweening.push(tween);
    return tween;
  }

  private checkAndCreateArray(items: string | string[]): any[] {
    return Array.isArray(items) ? items : items ? [items] : [];
  }

  lerp(a1: number, a2: number, t: number): number {
    return a1 * (1 - t) + a2 * t;
  }

  backout(amount: number): (t: number) => number {
    return (t) => (--t * t * ((amount + 1) * t + amount) + 1);
  }

}
