const FIREBASE_FUNCTIONS_URL = "https://asia-northeast1-quickstart-1587635856027.cloudfunctions.net/scrapingNPB"
const SLACK_WEBHOOK_URL = PropertiesService.getScriptProperties().getProperty("SLACK_WEBHOOK_URL");;
const MY_USER_ID = PropertiesService.getScriptProperties().getProperty("SLACK_USER_ID");;

export type ResultType = {
  dateInfo: string;
  gameInfoList: GameInfo[];
}

export type GameInfo = {
  leftTeamName: string;
  rightTeamName: string;
  leftTeamScore: string;
  rightTeamScore: string;
  gameStateInfo: string;
}

export type ParsedScoreInfo = {
  leftTeamScore: string;
  rightTeamScore: string;
}


/**
 * 試合情報の取得
 * @returns {ResultType}
 */
function getGameInfo(): ResultType {
  const rawGameInfo: string = UrlFetchApp.fetch(FIREBASE_FUNCTIONS_URL).getContentText();
  const gameInfo: ResultType = JSON.parse(rawGameInfo);
  return gameInfo;
}

/**
 * 試合情報の整理
 * @param {ResultType} fetchedResult
 * @returns {string}
 */
function organizeGameInfo(fetchedResult: ResultType): string {
  const {
    dateInfo,
    gameInfoList,
  } = fetchedResult;
  const mentionToMe = `<@${MY_USER_ID}>\n`
  let organizedGameInfo = `${mentionToMe}${dateInfo}\n`;
  console.log(gameInfoList);
  for (let i = 0; i < gameInfoList.length; i ++) {
    const gameInfo: GameInfo = gameInfoList[i];
    const {
      leftTeamName,
      rightTeamName,
      leftTeamScore,
      rightTeamScore,
      gameStateInfo
    } = gameInfo;
    if (leftTeamName && rightTeamName) {
      if (leftTeamScore && rightTeamScore) {
        const gameInfo = `${leftTeamName} ${leftTeamScore} - ${rightTeamScore} ${rightTeamName}`;
        if (gameStateInfo) {
          organizedGameInfo += gameInfo + gameStateInfo;
        }
      } else {
        const gameInfo = `${leftTeamName} vs ${rightTeamName}`;
        if (gameStateInfo) {
          organizedGameInfo += gameInfo + gameStateInfo;
        }
        organizedGameInfo += gameInfo;
      }
    }
    organizedGameInfo += "\n";
  }
  return organizedGameInfo;
}

/**
 * Slack への通知
 * @param {string} organizedGameInfo
 */
function postToSlack(organizedGameInfo: string) {
  const payload = {
    text: organizedGameInfo
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
    console.log(gameInfo);
    const organizedGameInfo = organizeGameInfo(gameInfo);
    console.log(organizedGameInfo);
    postToSlack(organizedGameInfo);
  } catch (error) {
    console.log(error);
  }
}
