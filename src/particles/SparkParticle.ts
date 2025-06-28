import type p5 from "p5";
import { BaseParticle } from "./BaseParticle";
import type { AudioData } from "../types";
import type { ParticleRenderer } from "./renderers";

export class SparkParticle extends BaseParticle {
  private sparkIntensity: number;
  private sparkSize: number;

  constructor(
    p: p5,
    x: number,
    y: number,
    z: number,
    renderer: ParticleRenderer,
    baseColor: p5.Color
  ) {
    super(p, x, y, z, renderer);
    this.velocity.mult(p.random(4, 7)); // 火花のように速く
    this.maxLife = p.random(20, 50);
    this.life = this.maxLife;
    this.color = this.createColorVariation(p, baseColor);
    this.sparkIntensity = p.random(0.5, 1.0);
    this.sparkSize = p.random(1, 4);
    this.size = this.sparkSize;
  }

  update(p: p5, audioData?: AudioData): void {
    // 重力の影響
    this.velocity.y += 0.1;

    // 空気抵抗
    this.velocity.mult(0.98);

    this.updatePosition();
    this.updateLife();

    // スパークの強度が時間とともに減少
    this.sparkIntensity *= 0.95;
  }

  private createColorVariation(p: p5, baseColor: p5.Color): p5.Color {
    const newColor = p.color(baseColor.toString());
    const amount = p.random(20, 50); // 明るくする度合いをランダムに
    // 全体的に明るくする
    newColor.setRed(p.red(newColor) + amount);
    newColor.setGreen(p.green(newColor) + amount);
    newColor.setBlue(p.blue(newColor) + amount);
    newColor.setAlpha(p.random(220, 255)); // ほぼ不透明に
    return newColor;
  }
}
