import type p5 from "p5";
import { BaseParticle } from "./BaseParticle";
import type { AudioData } from "../types";
import type { ParticleRenderer } from "./renderers";

export class FireParticle extends BaseParticle {
  private frameCount: number;

  constructor(
    p: p5,
    x: number,
    y: number,
    z: number,
    renderer: ParticleRenderer,
    baseColor: p5.Color
  ) {
    super(p, x, y, z, renderer);
    this.velocity = p.createVector(p.random(-0.5, 0.5), p.random(-2, -1), 0);
    this.maxLife = p.random(30, 70);
    this.life = this.maxLife;
    this.color = this.createColorVariation(p, baseColor);
    this.frameCount = 0;
    this.size = p.random(8, 20);
  }

  update(p: p5, _audioData?: AudioData): void {
    this.frameCount++;

    // 炎らしい不規則な動き
    this.velocity.x += p.random(-0.2, 0.2);
    this.velocity.y += p.random(-0.1, 0.05);
    this.velocity.z += p.random(-0.2, 0.2);

    // 上昇しながら広がる
    this.velocity.y *= 0.98;
    this.velocity.limit(5);

    this.updatePosition();
    this.updateLife();

    // サイズが徐々に小さくなる
    this.size *= 0.99;
  }

  private createColorVariation(p: p5, baseColor: p5.Color): p5.Color {
    const newColor = p.color(baseColor.toString());
    const amount = 30;
    // 赤みを強調しつつ、全体的な明るさを保つ
    newColor.setRed(p.red(newColor) + p.random(0, amount));
    newColor.setGreen(p.green(newColor) + p.random(-amount / 2, amount / 2));
    newColor.setBlue(p.blue(newColor) + p.random(-amount, 0)); // 青みは減らす
    newColor.setAlpha(p.random(150, 220)); // 透明度を調整
    return newColor;
  }
}
