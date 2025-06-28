import type p5 from "p5";
import { BaseParticle } from "./BaseParticle";
import type { AudioData } from "../types";
import type { ParticleRenderer } from "./renderers";

export class StandardParticle extends BaseParticle {
  constructor(
    p: p5,
    x: number,
    y: number,
    z: number,
    renderer: ParticleRenderer,
    baseColor: p5.Color
  ) {
    super(p, x, y, z, renderer);
    this.color = this.createColorVariation(p, baseColor);
  }

  update(p: p5, audioData?: AudioData): void {
    this.updatePosition();
    this.updateLife();
  }

  private createColorVariation(p: p5, baseColor: p5.Color): p5.Color {
    const newColor = p.color(baseColor.toString());
    const amount = 20;
    newColor.setRed(p.red(newColor) + p.random(-amount, amount));
    newColor.setGreen(p.green(newColor) + p.random(-amount, amount));
    newColor.setBlue(p.blue(newColor) + p.random(-amount, amount));
    newColor.setAlpha(p.random(180, 255));
    return newColor;
  }
}
