// グローバル型定義
declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

// 音声解析データ
export interface AudioData {
  frequencies: Uint8Array;
  bassLevel: number;
  midLevel: number;
  trebleLevel: number;
  volume: number;
}

export {};
