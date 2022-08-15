const FIREBASE_FUNCTIONS_URL = PropertiesService.getScriptProperties().getProperty("FIREBASE_FUNCTIONS_URL");
const SLACK_WEBHOOK_URL = PropertiesService.getScriptProperties().getProperty("SLACK_WEBHOOK_URL");
const SLACK_USER_ID = PropertiesService.getScriptProperties().getProperty("SLACK_USER_ID");
const LINE_CHANNEL_ACCESS_TOKEN_NPB = PropertiesService.getScriptProperties().getProperty("LINE_CHANNEL_ACCESS_TOKEN_NPB");
const LINE_CHANNEL_ACCESS_TOKEN_HOME = PropertiesService.getScriptProperties().getProperty("LINE_CHANNEL_ACCESS_TOKEN_HOME");
const LINE_USER_ID = PropertiesService.getScriptProperties().getProperty("LINE_USER_ID");
const LINE_GROUP_ID = PropertiesService.getScriptProperties().getProperty("LINE_GROUP_ID");
const GARBAGE_MONDAY = PropertiesService.getScriptProperties().getProperty("GARBAGE_MONDAY");
const GARBAGE_TUESDAY = PropertiesService.getScriptProperties().getProperty("GARBAGE_TUESDAY");
const GARBAGE_WEDNESDAY = PropertiesService.getScriptProperties().getProperty("GARBAGE_WEDNESDAY");
const GARBAGE_THURSDAY = PropertiesService.getScriptProperties().getProperty("GARBAGE_THURSDAY");
const GARBAGE_FRIDAY = PropertiesService.getScriptProperties().getProperty("GARBAGE_FRIDAY");
const GARBAGE_SATURDAY = PropertiesService.getScriptProperties().getProperty("GARBAGE_SATURDAY");
const GARBAGE_SUNDAY = PropertiesService.getScriptProperties().getProperty("GARBAGE_SUNDAY");
const FIREBASE_AUTH_EMAIL = PropertiesService.getScriptProperties().getProperty("FIREBASE_AUTH_EMAIL");
const FIREBASE_AUTH_PASSWORD =
	PropertiesService.getScriptProperties().getProperty("FIREBASE_AUTH_PASSWORD");
const FIREBASE_AUTH_LOGIN_URL = PropertiesService.getScriptProperties().getProperty("FIREBASE_AUTH_LOGIN_URL");

type ResultType = {
  dateInfo: string;
  gameInfoList: GameInfo[];
}

type GameInfo = {
  leftTeamName: string;
  rightTeamName: string;
  leftTeamScore: string;
  rightTeamScore: string;
  gameStateInfo: string;
}

type ParsedScoreInfo = {
  leftTeamScore: string;
  rightTeamScore: string;
}

type SlackTextInfo = {
  type: string;
  text: string;
}

type SlackBlockInfo = {
  type: string;
  text: SlackTextInfo;
}

type SlackPayloadType = {
  blocks: SlackBlockInfo[];
}

/**
 * 試合情報の取得
 * @returns {ResultType}
 */
function getGameInfo(idToken: string): ResultType {
  const rawGameInfo: string = UrlFetchApp.fetch(FIREBASE_FUNCTIONS_URL, {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': `Bearer ${idToken}`,
    },
  }).getContentText();
  const gameInfo: ResultType = JSON.parse(rawGameInfo);
  return gameInfo;
}

/**
 * 試合情報の整理
 * @param {ResultType} fetchedResult
 * @returns {SlackPayloadType}
 */
function organizeGameInfo(fetchedResult: ResultType): SlackPayloadType {
  const {
    dateInfo,
    gameInfoList,
  } = fetchedResult;
  const payload: SlackPayloadType = {
    blocks: []
  }
  const mentionBlockInfo: SlackBlockInfo = {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `<@${SLACK_USER_ID}>\n\n`
    }
  };
  payload.blocks.push(mentionBlockInfo);

  if (dateInfo && gameInfoList && gameInfoList.length > 0) {
    const dateBlockInfo: SlackBlockInfo = {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `${dateInfo}\n\n`
      }
    }
    payload.blocks.push(dateBlockInfo);

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
            const gameBlockInfo: SlackBlockInfo = {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `• ${gameInfo + "\n" + gameStateInfo + "\n"}`
              }
            };
            payload.blocks.push(gameBlockInfo);
          } else {
            const gameBlockInfo: SlackBlockInfo = {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `• ${gameInfo + "\n"}`
              }
            };
            payload.blocks.push(gameBlockInfo);
          }
        } else {
          const gameInfo = `${leftTeamName} vs ${rightTeamName}`;
          if (gameStateInfo) {
            const gameBlockInfo: SlackBlockInfo = {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `• ${gameInfo + "\n" + gameStateInfo + "\n"}`
              }
            };
            payload.blocks.push(gameBlockInfo);
          } else {
            const gameBlockInfo: SlackBlockInfo = {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `• ${gameInfo + "\n"}`
              }
            };
            payload.blocks.push(gameBlockInfo);
          }
        }
      }
    }
  } else {
    const noGameDayInfo: SlackBlockInfo = {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '今日は試合がありません'
      }
    };
    payload.blocks.push(noGameDayInfo);
  }
  return payload;
}

/**
 * Slack への通知
 * @param {SlackPayloadType} organizedGameInfo
 */
function postToSlack(organizedGameInfo: SlackPayloadType) {
  const options = {
    'method' : 'post',
    'contentType': 'application/json',
    'payload' : JSON.stringify(organizedGameInfo)
  };
  const response = UrlFetchApp.fetch(SLACK_WEBHOOK_URL, options);
  console.log(response);
}

/**
 * LINE 用のメッセージ整形
 * @param {ResultType} fetchedResult
 * @returns {string}
 */
function organizeGameInfoForLine(fetchedResult: ResultType): string {
  const {
    dateInfo,
    gameInfoList,
  } = fetchedResult;
  let organizedGameInfoForLine = '';
  if (dateInfo && dateInfo.length > 0) {
    organizedGameInfoForLine += `${dateInfo}\n\n`;
  }

  if (gameInfoList && gameInfoList.length > 0) {
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
            organizedGameInfoForLine += `• ${gameInfo + "\n" + gameStateInfo + "\n\n"}`
          } else {
            organizedGameInfoForLine += `• ${gameInfo + "\n\n"}`
          }
        } else {
          const gameInfo = `${leftTeamName} vs ${rightTeamName}`;
          if (gameStateInfo) {
            organizedGameInfoForLine += `• ${gameInfo + "\n" + gameStateInfo + "\n\n"}`
          } else {
            organizedGameInfoForLine += `• ${gameInfo + "\n\n"}`
          }
        }
      }
    }
  } else {
    organizedGameInfoForLine += '今日は試合がありません';
  }
  return organizedGameInfoForLine;
}

/**
 * LINE への通知
 */
function postToLINE() {
  try {
    const gameInfo = getGameInfo();
    console.log(gameInfo);
    const organizedGameInfoForLine = organizeGameInfoForLine(gameInfo);
    console.log(organizedGameInfoForLine);
    // LINE Messaging APIの利用のための下準備
    const url = 'https://api.line.me/v2/bot/message/push';
    // メッセージ本文を格納する変数
    const body = organizedGameInfoForLine.length > 0
      ? organizedGameInfoForLine
      : '今日は試合がありません';

    UrlFetchApp.fetch(url, {
      'headers': {
          'Content-Type': 'application/json; charset=UTF-8',
          'Authorization': 'Bearer ' + LINE_CHANNEL_ACCESS_TOKEN_NPB,
      },
      'method': 'POST',
      'payload': JSON.stringify({
          'to': LINE_USER_ID,
          'messages': [{
              'type': 'text',
              'text': body,
          }]
      })
    })
  } catch (error) {
    console.log(error);
  }
}

function getTomorrowGarbageInfo() {
  const todayWeekNum = new Date().getDay();
  const tomorrowWeekNum = todayWeekNum === 6
    ? 0
    : todayWeekNum + 1;
  const weekDays = [
    "日曜日",
    "月曜日",
    "火曜日",
    "水曜日",
    "木曜日",
    "金曜日",
    "土曜日"
  ];
  const garbages = [
    GARBAGE_SUNDAY,
    GARBAGE_MONDAY,
    GARBAGE_TUESDAY,
    GARBAGE_WEDNESDAY,
    GARBAGE_THURSDAY,
    GARBAGE_FRIDAY,
    GARBAGE_SATURDAY,
  ]
  const tomorrowDay = weekDays[tomorrowWeekNum];
  const tomorrowGarbage = garbages[tomorrowWeekNum];
  const message = `明日は${tomorrowDay}
${tomorrowGarbage} の日

  `
  console.log(message);
  return message;
}

/**
 * ゴミ出しの情報一覧取得
 */
function getGarbageInfoList() {
  const MondayInfo = GARBAGE_MONDAY;
  const TuesdayInfo = GARBAGE_TUESDAY;
  const WednesdayInfo = GARBAGE_WEDNESDAY;
  const ThursdayInfo = GARBAGE_THURSDAY;
  const FridayInfo = GARBAGE_FRIDAY;
  const SaturdayInfo = GARBAGE_SATURDAY;
  const SundayInfo = GARBAGE_SUNDAY;
  const message = `ゴミ出しの日一覧

  月曜日: ${MondayInfo}
  火曜日: ${TuesdayInfo}
  水曜日: ${WednesdayInfo}
  木曜日: ${ThursdayInfo}
  金曜日: ${FridayInfo}
  土曜日: ${SaturdayInfo}
  日曜日: ${SundayInfo}
  `
  return message;
}

/**
 * ゴミ出しの通知
 */
function notifyAboutGarbage() {
  try {
    const url = 'https://api.line.me/v2/bot/message/push';
    const tomorrowInfo = getTomorrowGarbageInfo();
    const garbageInfoList = getGarbageInfoList();
    const message = tomorrowInfo + garbageInfoList;

    UrlFetchApp.fetch(url, {
      'headers': {
          'Content-Type': 'application/json; charset=UTF-8',
          'Authorization': 'Bearer ' + LINE_CHANNEL_ACCESS_TOKEN_HOME,
      },
      'method': 'POST',
      'payload': JSON.stringify({
          'to': LINE_GROUP_ID,
          'messages': [{
              'type': 'text',
              'text': message,
          }]
      })
    });
  } catch (error) {
    console.log(error);
  }
}

/**
 * REST API を利用した、Firebase Authentication へのログイン
 */
async function loginToFirebase() {
  const loginResponse = UrlFetchApp.fetch(FIREBASE_AUTH_LOGIN_URL, {
    'headers': {
        'Content-Type': 'application/json; charset=UTF-8',
    },
    'method': 'POST',
    'payload': JSON.stringify({
      'email': FIREBASE_AUTH_EMAIL,
      'password': FIREBASE_AUTH_PASSWORD,
      'returnSecureToken': true,
    })
  });
  const { idToken } = loginResponse;
  return idToken;
}

/**
 * メイン関数
 */
function main() {
  try {
    const idToken = loginToFirebase();
    const gameInfo = getGameInfo(idToken);
    console.log(gameInfo);
    const organizedGameInfo = organizeGameInfo(gameInfo);
    console.log(organizedGameInfo);
    postToSlack(organizedGameInfo);
  } catch (error) {
    console.log(error);
    const e = error as Error;
    const payload: SlackPayloadType = {
      blocks: []
    }
    const mentionBlockInfo: SlackBlockInfo = {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `<@${SLACK_USER_ID}>\n\n`
      }
    };
    payload.blocks.push(mentionBlockInfo);
    const errorInfo: SlackBlockInfo = {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `• ${e.message + "\n"}`
      }
    };
    payload.blocks.push(errorInfo);
    const options = {
      'method' : 'post',
      'contentType': 'application/json',
      'payload' : JSON.stringify(payload)
    };
    const response = UrlFetchApp.fetch(SLACK_WEBHOOK_URL, options);
    console.log(response);
  }
}
