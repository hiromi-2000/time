import type p5 from "p5";
import type { BaseParticle } from "./BaseParticle";

export type ParticleRenderer = (p: p5, particle: BaseParticle) => void;

/**
 * 立方体を描画するレンダラー
 */
export const renderBox: ParticleRenderer = (p, particle) => {
  const alpha = particle.getAlpha();
  p.push();
  p.translate(particle.position.x, particle.position.y, particle.position.z);

  // 時間経過で回転させる
  p.rotateX(p.frameCount * 0.005 + particle.position.x);
  p.rotateY(p.frameCount * 0.005 + particle.position.y);

  p.fill(
    p.red(particle.color),
    p.green(particle.color),
    p.blue(particle.color),
    alpha
  );
  p.noStroke();
  p.box(particle.size);
  p.pop();
};

/**
 * 球体をレンダリングするレンダラー
 */
export const renderSphere: ParticleRenderer = (p, particle) => {
  const alpha = particle.getAlpha();
  p.push();
  p.translate(particle.position.x, particle.position.y, particle.position.z);
  p.fill(
    p.red(particle.color),
    p.green(particle.color),
    p.blue(particle.color),
    alpha
  );
  p.noStroke();
  p.sphere(particle.size);
  p.pop();
};

/**
 * 利用可能なレンダラーのリスト
 */
export const availableRenderers: ParticleRenderer[] = [renderBox, renderSphere];
