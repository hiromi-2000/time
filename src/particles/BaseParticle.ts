import type p5 from "p5";
import type { AudioData } from "../types";
import type { ParticleRenderer } from "./renderers";

export abstract class BaseParticle {
  position: p5.Vector;
  velocity: p5.Vector;
  size: number;
  life: number;
  maxLife: number;
  color: p5.Color;
  renderer: ParticleRenderer;

  constructor(
    p: p5,
    x: number,
    y: number,
    z: number,
    renderer: ParticleRenderer
  ) {
    this.position = p.createVector(x, y, z);
    this.velocity = p
      .createVector(p.random(-1, 1), p.random(-1, 1), p.random(-1, 1))
      .normalize()
      .mult(p.random(1, 3));
    this.size = p.random(5, 15);
    this.maxLife = p.random(60, 240); // 寿命を少し延ばす
    this.life = this.maxLife;
    this.color = p.color(255); // デフォルト色
    this.renderer = renderer;
  }

  abstract update(p: p5, audioData?: AudioData): void;

  display(p: p5): void {
    this.renderer(p, this);
  }

  isDead(): boolean {
    return this.life <= 0;
  }

  // 共通のライフサイクル管理
  protected updateLife(): void {
    this.life--;
  }

  // 共通の移動処理
  protected updatePosition(): void {
    this.position.add(this.velocity);
  }

  // アルファ値を計算する共通メソッド
  getAlpha(): number {
    return (this.life / this.maxLife) * 255;
  }
}
