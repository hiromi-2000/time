import p5 from "p5";
import { audioElement, isPlaying, getAudioData, togglePlayPause } from "./main";
import type { AudioData } from "./types";
import { ParticleManager, type ParticleType } from "./particles";
import { drawSpectrumTunnel } from "./visuals/tunnel";
import {
  drawCentralObject,
  drawRotatingElements,
  drawFilmObject,
} from "./visuals/objects";
import { colorThemes, getThemeColors, tunnelHueRanges } from "./visuals/themes";

// BPM同期イベント関連
const BPM = 142;
const BEATS_PER_BAR = 4;
const BARS_PER_EVENT = 16;
const DURATION_PER_BAR = (60 / BPM) * BEATS_PER_BAR;
let lastTriggeredBlock = 0;

const config = {
  camera: {
    speed: 15,
    initialZ: 800,
  },
  tunnel: {
    historyLength: 30,
    zStep: 20,
    zOffset: 50,
    skipAmount: 3,
    wireframeSkipAmount: 5,
  },
  centralObject: {
    zOffset: -4000,
    size: 1000,
    stroke: { r: 100, g: 100, b: 255, a: 150 },
  },
  rotatingElements: {
    zOffset: -1000,
  },
  audioCircles: {
    zOffset: -1500,
  },
};

export type Config = typeof config;

let time = 0;
let particleManager: ParticleManager;
let colors: p5.Color[] = [];
let spectrumHistory: number[][] = [];
let currentThemeIndex = 0;
let firstClickDone = false;
let filmObject: {
  isVisible: boolean;
  color: p5.Color | null;
  startTime: number;
  duration: number;
  initialAlpha: number;
  size: number;
  z: number;
} | null = null;

// カメラ設定
let cameraZ: number;
let isMovingForward = true;

function generateAudioParticles(p: p5, audioData: AudioData): void {
  // パーティクルはカメラの前方、少し遠くに生成
  const z = cameraZ - p.random(500, 4000);
  const center = p.createVector(0, 0, z);
  const allowedTypes = colorThemes[currentThemeIndex].particleTypes;
  particleManager.generateAudioParticles(p, center, audioData, allowedTypes);
}

const sketch = (p: p5): void => {
  const triggerSixteenBarEvent = () => {
    // フィルムオブジェクトを生成
    filmObject = {
      isVisible: true,
      color: p.random(colors),
      startTime: p.millis(),
      duration: DURATION_PER_BAR * 1000 * 2, // 2小節分
      initialAlpha: 80,
      size: p.max(p.width, p.height) * 2,
      z: cameraZ - 500, // 初期位置はカメラの少し奥
    };

    console.log(`16-bar event triggered at ${audioElement?.currentTime}`);
    const allowedTypes = colorThemes[currentThemeIndex].particleTypes;
    if (allowedTypes.length === 0) return;

    // どのパーティクルを爆発させるか（sparkがあれば優先）
    const burstType = allowedTypes.includes("spark")
      ? "spark"
      : p.random(allowedTypes);

    // 画面中央付近の少し手前にバースト
    const zPos = cameraZ - p.random(500, 1500);
    const x = p.random(-p.width / 4, p.width / 4);
    const y = p.random(-p.height / 4, p.height / 4);
    particleManager.addParticles(p, x, y, zPos, 100, burstType);
  };

  const updateTheme = (index: number) => {
    currentThemeIndex = index % colorThemes.length;
    const theme = colorThemes[currentThemeIndex];
    colors = getThemeColors(p, theme);
    particleManager.updateColors(colors);
    p.background(theme.background);
  };

  p.setup = (): void => {
    const canvas = p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
    canvas.parent("sketch-container");
    cameraZ = config.camera.initialZ; // オブジェクトが見える位置からスタート

    // パーティクルマネージャーを初期化
    particleManager = new ParticleManager([]); // 初期色はテーマで設定

    // BPMイベントのリセットリスナー
    window.addEventListener("music-ended", () => {
      lastTriggeredBlock = 0;
      console.log("BPM event tracker has been reset.");
    });

    // 初期テーマを設定
    updateTheme(0);
  };

  p.draw = (): void => {
    // BPM同期待ち受け
    if (isPlaying && audioElement && audioElement.currentTime > 0) {
      const currentBar = Math.floor(
        audioElement.currentTime / DURATION_PER_BAR
      );
      const currentBlock = Math.floor(currentBar / BARS_PER_EVENT);
      if (currentBlock > lastTriggeredBlock) {
        triggerSixteenBarEvent();
        lastTriggeredBlock = currentBlock;
      }
    }

    const audioData = getAudioData();
    const theme = colorThemes[currentThemeIndex];
    // 背景色
    p.background(theme.background);

    // カメラの更新
    if (isMovingForward) {
      cameraZ -= config.camera.speed; // 前進するように方向を反転
    }
    // 常に前を向くようにカメラを設定
    p.camera(0, 0, cameraZ, 0, 0, cameraZ - 1, 0, 1, 0);

    // 遠近法の設定
    const fov = p.PI / 6.0;
    const near = 1; // nearクリップを調整
    const far = 5000;
    p.perspective(fov, p.width / p.height, near, far);

    // フィルムオブジェクトの描画と更新
    if (filmObject && filmObject.isVisible) {
      const elapsedTime = p.millis() - filmObject.startTime;
      if (elapsedTime > filmObject.duration) {
        filmObject.isVisible = false;
      } else {
        // フェードイン・アウト
        const progress = elapsedTime / filmObject.duration;
        let alpha;
        if (progress < 0.1) {
          // 10%でフェードイン
          alpha = p.map(progress, 0, 0.1, 0, filmObject.initialAlpha);
        } else if (progress > 0.95) {
          // 最後の5%でフェードアウト
          alpha = p.map(progress, 0.95, 1, filmObject.initialAlpha, 0);
        } else {
          alpha = filmObject.initialAlpha;
        }

        // 奥に流れるようにZ座標を更新
        filmObject.z -= 10;

        if (filmObject.color) {
          drawFilmObject(
            p,
            filmObject.color,
            alpha,
            filmObject.size,
            filmObject.z
          );
        }
      }
    }

    // ライティング
    p.ambientLight(60);
    p.directionalLight(255, 255, 255, 0.5, 0.5, -1);

    time += 0.02;

    // 中央の巨大オブジェクトを常に描画
    drawCentralObject(p, time, cameraZ, config, colors);

    // 音楽が再生中の場合の特別なエフェクト
    if (isPlaying && audioElement) {
      generateAudioParticles(p, audioData);

      // 周波数スペクトラムまたはデフォルト波形の描画
      if (audioData.frequencies.length > 0) {
        // 履歴の先頭に現在のフレームを追加
        spectrumHistory.unshift(Array.from(audioData.frequencies));
        // 履歴が長くなりすぎたら末尾を削除
        if (spectrumHistory.length > config.tunnel.historyLength) {
          spectrumHistory.pop();
        }
        drawSpectrumTunnel(
          p,
          spectrumHistory,
          cameraZ,
          config,
          tunnelHueRanges[currentThemeIndex]
        );
      }
      // 回転する要素
      drawRotatingElements(
        p,
        audioData,
        time,
        cameraZ,
        config,
        isPlaying,
        colors
      );
    } else {
      // 再生が止まったら履歴をクリア
      spectrumHistory = [];
    }

    // パーティクルの更新と描画
    particleManager.update(p, audioData);
    particleManager.display(p);

    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };

  p.mousePressed = (): void => {
    if (!firstClickDone) {
      togglePlayPause();
      firstClickDone = true;
      return;
    }
    // 2回目以降のクリックはテーマ変更
    updateTheme(currentThemeIndex + 1);
  };

  // キーボードショートカットでパーティクルタイプを選択
  p.keyPressed = (): void => {
    const zPos = cameraZ - p.random(500, 4000); // カメラ前のランダムな深度に
    const x = p.random(-p.width / 2, p.width / 2);
    const y = p.random(-p.height / 2, p.height / 2);

    const allowedTypes = colorThemes[currentThemeIndex].particleTypes;
    if (allowedTypes.length === 0) return;
    const randomType = p.random(allowedTypes);

    // キー入力に応じてパーティクルを生成（ただし、テーマで許可されたもののみ）
    // 'c'と' 'はグローバルなショートカットとして残す
    switch (p.key) {
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
        particleManager.addParticles(p, x, y, zPos, 2, randomType);
        break;
      case "c":
        particleManager.clear();
        break;
      case " ":
        isMovingForward = !isMovingForward;
        break;
    }
  };
};

// p5.jsインスタンスの作成
new p5(sketch);
