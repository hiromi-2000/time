import type p5 from "p5";
import { BaseParticle } from "./BaseParticle";
import type { AudioData } from "../types";
import type { ParticleRenderer } from "./renderers";

export class AudioParticle extends BaseParticle {
  private readonly frequency: number;
  private readonly initialSize: number;

  constructor(
    p: p5,
    x: number,
    y: number,
    z: number,
    renderer: ParticleRenderer,
    frequency: number,
    baseColor: p5.Color
  ) {
    super(p, x, y, z, renderer);
    this.maxLife = 80;
    this.life = this.maxLife;
    this.color = this.createColorVariation(p, baseColor);
    this.frequency = frequency;
    this.initialSize = this.size;
  }

  update(p: p5, audioData?: AudioData): void {
    if (audioData) {
      // 音響データに基づいてサイズを調整
      const volumeMultiplier = 1 + audioData.volume * 2;
      this.size = this.initialSize * volumeMultiplier;

      // 周波数レベルに応じて動きを調整
      const frequencyLevel =
        this.frequency < 0.3
          ? audioData.bassLevel
          : this.frequency < 0.7
            ? audioData.midLevel
            : audioData.trebleLevel;

      const acceleration = 1 + frequencyLevel * 0.1;
      this.velocity.mult(acceleration);

      // 速度が大きくなりすぎないように制限
      this.velocity.limit(10);
    }

    this.updatePosition();
    this.updateLife();
  }

  private createColorVariation(p: p5, baseColor: p5.Color): p5.Color {
    const newColor = p.color(baseColor.toString());
    const amount = 25;
    newColor.setRed(p.red(newColor) + p.random(-amount, amount));
    newColor.setGreen(p.green(newColor) + p.random(-amount, amount));
    newColor.setBlue(p.blue(newColor) + p.random(-amount, amount));
    newColor.setAlpha(p.random(180, 255));
    return newColor;
  }
}
