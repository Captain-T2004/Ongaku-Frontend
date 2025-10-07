export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const LANGUAGES = {
  EN: 'en',
  JA: 'ja'
};

export const VOICE_STATES = {
  IDLE: 'idle',
  LISTENING: 'listening',
  PROCESSING: 'processing',
  ERROR: 'error'
};

export const MESSAGES = {
  en: {
    voiceButton: 'Tap to speak',
    listening: 'Listening...',
    processing: 'Processing...',
    placeholder: 'Ask about music activities...',
    weatherLabel: 'Current Weather',
    errorGeneric: 'Something went wrong. Please try again.',
    errorBrowser: 'Speech recognition not supported in this browser.',
    errorMicrophone: 'Microphone access denied.',
    noResults: 'No activities found. Try a different query.'
  },
  ja: {
    voiceButton: 'タップして話す',
    listening: '聞いています...',
    processing: '処理中...',
    placeholder: '音楽活動について質問してください...',
    weatherLabel: '現在の天気',
    errorGeneric: 'エラーが発生しました。もう一度お試しください。',
    errorBrowser: 'このブラウザは音声認識に対応していません。',
    errorMicrophone: 'マイクへのアクセスが拒否されました。',
    noResults: 'アクティビティが見つかりませんでした。別のクエリを試してください。'
  }
};

export const ACTIVITY_ICONS = {
  venue: '🎵',
  playlist: '🎧',
  practice: '🎹',
  shopping: '🛍️',
  cafe: '☕',
  planning: '📅'
};
