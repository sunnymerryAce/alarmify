/* eslint-disable global-require */
/**
 * Firestoreユーザ情報取得
 */
if (
  !process.env.FUNCTION_NAME
  || process.env.FUNCTION_NAME === 'getUserFromFirestore'
) {
  exports.getUserFromFirestore = require('./functions/getUserFromFirestore');
}

/**
 * Spotifyプレイリスト一覧取得
 */
if (
  !process.env.FUNCTION_NAME
  || process.env.FUNCTION_NAME === 'getPlaylists'
) {
  exports.getPlaylists = require('./functions/getPlaylists');
}

/**
 * アラーム設定
 */
if (
  !process.env.FUNCTION_NAME
  || process.env.FUNCTION_NAME === 'scheduleAlarm'
) {
  exports.scheduleAlarm = require('./functions/scheduleAlarm');
}

/**
 * Spotify再生
 */
if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'playSpotify') {
  exports.playSpotify = require('./functions/playSpotify');
}
