import p5 from "p5";
import type { BaseParticle } from "./BaseParticle";
import type { AudioData } from "../types";
import { createParticleFactory, type ParticleCreator } from "./ParticleFactory";

export type ParticleType = "standard" | "audio" | "trail" | "fire" | "spark";

const MAX_PARTICLES = 500; // パーティクルの最大数

export class ParticleManager {
  private particles: BaseParticle[] = [];
  private createParticle: ParticleCreator;

  constructor(colors: p5.Color[]) {
    this.createParticle = createParticleFactory(colors);
  }

  updateColors(colors: p5.Color[]): void {
    this.createParticle = createParticleFactory(colors);
  }

  // パーティクルを追加
  addParticle(
    p: p5,
    x: number,
    y: number,
    z: number,
    type: ParticleType = "standard"
  ): void {
    if (this.particles.length >= MAX_PARTICLES) {
      this.particles.shift(); // 古いパーティクルを削除
    }
    const particle = this.createParticle(p, x, y, z, type);
    this.particles.push(particle);
  }

  // 複数のパーティクルを一度に追加
  addParticles(
    p: p5,
    x: number,
    y: number,
    z: number,
    count: number,
    type: ParticleType = "standard"
  ): void {
    for (let i = 0; i < count; i++) {
      const offsetX = x + p.random(-20, 20);
      const offsetY = y + p.random(-20, 20);
      const offsetZ = z + p.random(-20, 20);
      this.addParticle(p, offsetX, offsetY, offsetZ, type);
    }
  }

  // 音響データに基づいてパーティクルを生成
  generateAudioParticles(
    p: p5,
    center: p5.Vector,
    audioData: AudioData,
    allowedTypes: ParticleType[]
  ): void {
    const particleChance = audioData.volume * 1;
    if (p.random() < particleChance) {
      // 3D空間にランダムに配置
      const pos = p5.Vector.random3D().mult(p.random(100, 300));
      const position = p5.Vector.add(center, pos);

      // 音量に応じた優先順位でパーティクルタイプを決定
      const preferredTypes: [number, ParticleType][] = [
        [0.8, "fire"],
        [0.6, "spark"],
        [0.4, "trail"],
        [0.2, "audio"],
      ];

      let type: ParticleType = "standard";
      for (const [threshold, preferredType] of preferredTypes) {
        if (
          audioData.volume > threshold &&
          allowedTypes.includes(preferredType)
        ) {
          type = preferredType;
          break;
        }
      }

      // 候補が見つからない場合、許可リストの最初のもの（standard以外）かstandardを使う
      if (
        type === "standard" &&
        !allowedTypes.includes("standard") &&
        allowedTypes.length > 0
      ) {
        type = p.random(allowedTypes);
      }

      this.addParticle(p, position.x, position.y, position.z, type);
    }
  }

  // すべてのパーティクルを更新
  update(p: p5, audioData?: AudioData): void {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      particle.update(p, audioData);

      // 死んだパーティクルを削除
      if (particle.isDead()) {
        this.particles.splice(i, 1);
      }
    }
  }

  // すべてのパーティクルを描画
  display(p: p5): void {
    for (const particle of this.particles) {
      particle.display(p);
    }
  }

  // パーティクル数を取得
  getCount(): number {
    return this.particles.length;
  }

  // すべてのパーティクルをクリア
  clear(): void {
    this.particles = [];
  }

  // 特定のタイプのパーティクル数を取得
  getCountByType(type: new (...args: never[]) => BaseParticle): number {
    return this.particles.filter((p) => p instanceof type).length;
  }
}
