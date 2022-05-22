const FIREBASE_FUNCTIONS_URL = "https://asia-northeast1-quickstart-1587635856027.cloudfunctions.net/scrapingNPB"
const SLACK_WEBHOOK_URL = "https://hooks.slack.com/services/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";

/**
 * 試合情報の取得
 * @returns {string}
 */
function getGameInfo(): string {
  const gameInfo = UrlFetchApp.fetch(FIREBASE_FUNCTIONS_URL).getContentText();
  return gameInfo;
}

/**
 * Slack への通知
 * @param {string} gameinfo
 */
function postToSlack(gameInfo: string) {
  const payload = {
    text: gameInfo
  }
  const options = {
    'method' : 'post',
    'contentType': 'application/json',
    'payload' : JSON.stringify(payload)
  };
  const response = UrlFetchApp.fetch(SLACK_WEBHOOK_URL, options);
  console.log(response);
}

/**
 * メイン関数
 */
function main() {
  try {
    const gameInfo = getGameInfo();
    postToSlack(gameInfo);
  } catch (error) {
    console.log(error);
  }
}

main();
