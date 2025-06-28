import type p5 from "p5";
import { BaseParticle } from "./BaseParticle";
import type { AudioData } from "../types";
import type { ParticleRenderer } from "./renderers";

export class TrailParticle extends BaseParticle {
  private trail: p5.Vector[] = [];
  private readonly maxTrailLength = 10;

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
    this.velocity.mult(p.random(3, 6));
    this.maxLife = p.random(120, 200);
    this.life = this.maxLife;
  }

  update(_p: p5, _audioData?: AudioData): void {
    this.updatePosition();
    this.updateLife();

    // 軌跡を更新
    this.trail.push(this.position.copy());
    if (this.trail.length > this.maxTrailLength) {
      this.trail.shift();
    }
  }

  private createColorVariation(p: p5, baseColor: p5.Color): p5.Color {
    const newColor = p.color(baseColor.toString());
    const amount = 30;
    newColor.setRed(p.red(newColor) + p.random(-amount, amount));
    newColor.setGreen(p.green(newColor) + p.random(-amount, amount));
    newColor.setBlue(p.blue(newColor) + p.random(-amount, amount));
    newColor.setAlpha(p.random(200, 255));
    return newColor;
  }
}
