import type p5 from "p5";

export function drawDefaultWaveform(p: p5, time: number): void {
  p.push();
  p.translate(0, 0, -200);
  p.stroke(255, 150);
  p.strokeWeight(2);
  p.noFill();
  p.beginShape();
  for (let x = -p.width / 2; x < p.width / 2; x += 20) {
    const y = p.sin(time + x * 0.01) * 100 * p.sin(time * 0.5);
    p.vertex(x, y, 0);
  }
  p.endShape();
  p.pop();
}
