import type p5 from "p5";
import type { Config } from "../sketch";

// 色相を180度回転させる関数
function getOppositeHue(hue: number): number {
  return (hue + 180) % 360;
}

export function drawSpectrumTunnel(
  p: p5,
  spectrumHistory: number[][],
  cameraZ: number,
  config: Config,
  hueRange: [number, number]
): void {
  if (spectrumHistory.length < 2) return;

  p.push();
  // 画面下部中央あたりを基準にする
  p.translate(0, p.height / 20, 0);

  const numHistory = spectrumHistory.length;
  const numFreqs = spectrumHistory[0]?.length || 0;
  if (numFreqs === 0) return;

  const zStep = config.tunnel.zStep;
  const dimension = Math.min(p.width, p.height);

  // 画面幅に応じて線の太さを動的に変更
  const mainStrokeWeight = p.map(p.width, 300, 1920, 0.5, 2, true);
  const wireframeStrokeWeight = mainStrokeWeight * 0.5;

  // 色相範囲を反転させる
  const oppositeHueRange: [number, number] = [
    getOppositeHue(hueRange[0]),
    getOppositeHue(hueRange[1]),
  ];

  // 周波数ごとにZ軸方向の連続した線を描画する
  for (let i = 0; i < numFreqs; i++) {
    // スキップして描画負荷を軽減
    if (i % config.tunnel.skipAmount !== 0) continue;

    const hue = p.map(
      i,
      0,
      numFreqs - 1,
      oppositeHueRange[0],
      oppositeHueRange[1]
    );

    // 左右の線を同時に描画
    for (const sign of [-1, 1]) {
      p.beginShape();
      p.noFill();
      p.strokeWeight(mainStrokeWeight);
      for (let j = 0; j < numHistory; j++) {
        const spectrum = spectrumHistory[j];
        if (!spectrum) continue;
        const alpha = p.map(j, 0, numHistory - 1, 255, 10); // 奥に行くほど薄く
        p.stroke(hue, 200, 255, alpha);
        const x = sign * p.map(i, 0, numFreqs - 1, 0, dimension / 2.5); // 中央から左右へ
        const y = p.map(spectrum[i], 0, 255, 0, dimension / 4); // Y軸下方向
        const z = cameraZ - config.tunnel.zOffset - j * zStep; // オフセットを調整して手前に
        p.vertex(x, y, z);
      }
      p.endShape();
    }
  }

  // ワイヤーフレームの「横線」を追加して格子状にする
  for (let j = 0; j < numHistory; j++) {
    // 横線はさらに間引いて描画負荷を軽減
    if (j % config.tunnel.wireframeSkipAmount !== 0) continue;

    const spectrum = spectrumHistory[j];
    if (!spectrum) continue;

    const alpha = p.map(j, 0, numHistory - 1, 200, 0); // 奥はさらに薄く
    const z = cameraZ - config.tunnel.zOffset - j * zStep;

    // 左右の横線を同時に描画
    for (const sign of [-1, 1]) {
      p.beginShape();
      p.noFill();
      p.strokeWeight(wireframeStrokeWeight); // 横線は少し細く
      for (let i = 0; i < numFreqs; i++) {
        const hue = p.map(
          i,
          0,
          numFreqs - 1,
          oppositeHueRange[0],
          oppositeHueRange[1]
        );
        p.stroke(hue, 200, 255, alpha);
        const x = sign * p.map(i, 0, numFreqs - 1, 0, dimension / 2.5);
        const y = p.map(spectrum[i], 0, 255, 0, dimension / 4);
        p.vertex(x, y, z);
      }
      p.endShape();
    }
  }

  p.pop();
}
