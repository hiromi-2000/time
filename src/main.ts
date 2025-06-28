import "./sketch";
import type { AudioData } from "./types";

// オーディオとUI制御
export let audioElement: HTMLAudioElement | null = null;
export let isPlaying = false;

// Web Audio API関連
let audioContext: AudioContext | null = null;
let analyser: AnalyserNode | null = null;
let dataArray: Uint8Array | null = null;
let source: MediaElementAudioSourceNode | null = null;

// 音声解析データ
/*
export interface AudioData {
  frequencies: Uint8Array
  bassLevel: number
  midLevel: number
  trebleLevel: number
  volume: number
}
*/

let currentAudioData: AudioData = {
  frequencies: new Uint8Array(0),
  bassLevel: 0,
  midLevel: 0,
  trebleLevel: 0,
  volume: 0,
};

// Web Audio APIのセットアップ
function setupAudioAnalysis(): void {
  if (!audioElement) return;

  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContextClass();
    analyser = audioContext.createAnalyser();

    // 解析設定
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.8;

    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    // オーディオソースを作成してアナライザーに接続
    source = audioContext.createMediaElementSource(audioElement);
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    // 解析ループを開始
    startAnalysis();

    console.log("Audio analysis setup complete");
  } catch (error) {
    console.error("Audio analysis setup failed:", error);
  }
}

// 音声解析のメインループ
function startAnalysis(): void {
  if (!analyser || !dataArray) return;

  function analyze(): void {
    if (!analyser || !dataArray) return;

    analyser.getByteFrequencyData(dataArray);

    // 周波数帯域の計算
    const bassEnd = Math.floor(dataArray.length * 0.1);
    const midEnd = Math.floor(dataArray.length * 0.4);

    let bassSum = 0;
    let midSum = 0;
    let trebleSum = 0;
    let totalSum = 0;

    for (let i = 0; i < dataArray.length; i++) {
      totalSum += dataArray[i];

      if (i < bassEnd) {
        bassSum += dataArray[i];
      } else if (i < midEnd) {
        midSum += dataArray[i];
      } else {
        trebleSum += dataArray[i];
      }
    }

    // 正規化
    currentAudioData = {
      frequencies: new Uint8Array(dataArray),
      bassLevel: bassSum / bassEnd / 255,
      midLevel: midSum / (midEnd - bassEnd) / 255,
      trebleLevel: trebleSum / (dataArray.length - midEnd) / 255,
      volume: totalSum / dataArray.length / 255,
    };

    requestAnimationFrame(analyze);
  }

  analyze();
}

// オーディオファイルの初期化
function initAudio(): void {
  audioElement = new Audio("/ttttt.mp3");
  audioElement.crossOrigin = "anonymous";

  audioElement.addEventListener("loadeddata", () => {
    console.log("Ready to play");
  });

  audioElement.addEventListener("ended", () => {
    isPlaying = false;
    console.log("Finished");
    window.dispatchEvent(new CustomEvent("music-ended"));
  });

  audioElement.addEventListener("error", (e) => {
    console.error("Audio loading error:", e);
  });
}

// 再生/一時停止をトグルする
export function togglePlayPause(): void {
  if (!audioElement) {
    console.log("Audio not ready");
    return;
  }

  if (isPlaying) {
    audioElement.pause();
    isPlaying = false;
  } else {
    // Web Audio APIのセットアップ（初回のみ）
    if (!audioContext) {
      setupAudioAnalysis();
    }
    // AudioContextが停止している場合は再開
    if (audioContext && audioContext.state === "suspended") {
      audioContext.resume();
    }
    audioElement.play().catch((e) => console.error("Play error:", e));
    isPlaying = true;
  }
}

// 初期化
window.addEventListener("DOMContentLoaded", () => {
  initAudio();
});

// オーディオデータを取得する関数
export function getAudioData(): AudioData {
  return currentAudioData;
}
