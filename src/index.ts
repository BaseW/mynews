import { getGameInfo, organizeGameInfo, postToSlack, organizeGameInfoForLine, getTomorrowGarbageInfo, getGarbageInfoList } from "./lib";
import { LINE_API_PUSH_MESSAGE_URL, LINE_CHANNEL_ACCESS_TOKEN_NPB, LINE_CHANNEL_ACCESS_TOKEN_HOME, LINE_GROUP_ID, LINE_USER_ID } from "./constants";

/**
 * Slack へ NPB の試合一覧を通知する関数
 */
function notifyToSlackAboutNPB() {
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

/**
 * LINE への通知
 */
function notifyToLINEAboutNPB() {
  try {
    const gameInfo = getGameInfo();
    console.log(gameInfo);
    const organizedGameInfoForLine = organizeGameInfoForLine(gameInfo);
    console.log(organizedGameInfoForLine);
    // LINE Messaging APIの利用のための下準備
    const url = LINE_API_PUSH_MESSAGE_URL;
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

/**
 * ゴミ出しの通知
 */
function notifyToLINEAboutGarbage() {
  try {
    const url = LINE_API_PUSH_MESSAGE_URL;
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

