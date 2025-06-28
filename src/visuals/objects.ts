import type p5 from "p5";
import type { AudioData } from "../types";
import type { Config } from "../sketch";

export function drawAudioResponsiveCircles(
  p: p5,
  audioData: AudioData,
  cameraZ: number,
  config: Config,
  colors: p5.Color[]
): void {
  p.push();
  // カメラからの相対位置に移動し、常に正面に表示
  p.translate(0, 0, cameraZ + config.audioCircles.zOffset);
  p.rotateX(p.PI / 2); // 見やすいように少し回転

  // 高音に応じた外側の円のみ残す
  const trebleRadius = 100 + audioData.trebleLevel * 200;
  const trebleColor = p.lerpColor(colors[0], colors[1], audioData.trebleLevel);

  p.stroke(trebleColor);
  p.strokeWeight(1 + audioData.trebleLevel * 1);
  p.noFill();
  p.sphere(trebleRadius);
  p.pop();
}

export function drawCentralObject(
  p: p5,
  time: number,
  cameraZ: number,
  config: Config,
  colors: p5.Color[]
): void {
  p.push();
  // 他のオブジェクトよりさらに奥の相対位置に配置
  p.translate(0, 0, cameraZ + config.centralObject.zOffset);

  // ゆっくりと回転
  p.rotateX(time * 0.05);
  p.rotateY(time * 0.08);

  // ワイヤーフレームで巨大な球を描画
  p.noFill();
  const mainColor = colors[2];
  mainColor.setAlpha(150);
  p.stroke(mainColor);
  p.strokeWeight(1);
  p.sphere(config.centralObject.size); // 巨大なサイズ

  p.pop();
}

export function drawRotatingElements(
  p: p5,
  audioData: AudioData,
  time: number,
  cameraZ: number,
  config: Config,
  isPlaying: boolean,
  colors: p5.Color[]
): void {
  p.push();
  // カメラからの相対位置に移動し、centralObjectとzOffsetを合わせる
  p.translate(0, 0, cameraZ + config.centralObject.zOffset);

  const rotationSpeed = isPlaying ? time + audioData.volume * 2 : time;
  p.rotateZ(rotationSpeed); // Z軸回転
  p.rotateX(rotationSpeed * 0.5);
  p.rotateY(rotationSpeed * 0.3);

  // zOffsetの変更に合わせてスケールを調整し、見た目のサイズを維持
  const scaleFactor =
    config.centralObject.zOffset / config.rotatingElements.zOffset;
  const lineLength =
    (isPlaying ? 50 + audioData.midLevel * 100 : 100) * scaleFactor;

  const rotatingColor = colors[3];
  rotatingColor.setAlpha(isPlaying ? 50 + audioData.volume * 150 : 100);
  p.stroke(rotatingColor);
  p.strokeWeight(1 + audioData.trebleLevel * 2);
  p.noFill();

  p.sphere(lineLength);
  p.pop();
}

export function drawFilmObject(
  p: p5,
  color: p5.Color,
  alpha: number,
  size: number,
  zPos: number
): void {
  p.push();
  // 指定されたZ座標に配置
  p.translate(0, 0, zPos);

  p.noStroke();
  color.setAlpha(alpha);
  p.fill(color);
  p.rectMode(p.CENTER);
  p.plane(size, size);
  p.pop();
}
