import p5 from "p5";
import {
  AudioParticle,
  BaseParticle,
  FireParticle,
  SparkParticle,
  StandardParticle,
  TrailParticle,
} from ".";
import type { ParticleType } from "./ParticleManager";
import { availableRenderers } from "./renderers";

export type ParticleCreator = (
  p: p5,
  x: number,
  y: number,
  z: number,
  type: ParticleType
) => BaseParticle;

export const createParticleFactory = (colors: p5.Color[]): ParticleCreator => {
  return (p, x, y, z, type) => {
    const renderer = p.random(availableRenderers);
    const baseColor = p.random(colors);

    switch (type) {
      case "standard":
        return new StandardParticle(p, x, y, z, renderer, baseColor);
      case "audio": {
        const frequency = p.random(0, 1);
        return new AudioParticle(p, x, y, z, renderer, frequency, baseColor);
      }
      case "trail": {
        return new TrailParticle(p, x, y, z, renderer, baseColor);
      }
      case "fire":
        return new FireParticle(p, x, y, z, renderer, baseColor);
      case "spark":
        return new SparkParticle(p, x, y, z, renderer, baseColor);
      default:
        return new StandardParticle(p, x, y, z, renderer, baseColor);
    }
  };
};
