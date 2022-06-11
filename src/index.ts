import {
  LineRequestPayload,
  LineRequestPostDataContent
} from "./types";

const LINE_CHANNEL_ACCESS_TOKEN_HOME = PropertiesService.getScriptProperties().getProperty("LINE_CHANNEL_ACCESS_TOKEN_HOME");
const LINE_USER_1_ID = PropertiesService.getScriptProperties().getProperty("LINE_USER_1_ID");
const LINE_USER_2_ID = PropertiesService.getScriptProperties().getProperty("LINE_USER_2_ID");
const MESSAGE_FOR_USER_1 = PropertiesService.getScriptProperties().getProperty("MESSAGE_FOR_USER_1");
const MESSAGE_FOR_USER_2 = PropertiesService.getScriptProperties().getProperty("MESSAGE_FOR_USER_2");
const LINE_API_PUSH_MESSAGE_URL = "https://api.line.me/v2/bot/message/push";
const FIREBASE_FUNCTIONS_REMIND_ITEMS_URL = PropertiesService.getScriptProperties().getProperty("FIREBASE_FUNCTIONS_REMIND_ITEMS_URL");

const validUserIdList = [LINE_USER_1_ID, LINE_USER_2_ID];
// const validUserIdList = [];

function sendErrorResponse(userId: string, message: string) {
  const url = LINE_API_PUSH_MESSAGE_URL;
  const body = message;
  try {
    UrlFetchApp.fetch(url, {
      'headers': {
          'Content-Type': 'application/json; charset=UTF-8',
          'Authorization': 'Bearer ' + LINE_CHANNEL_ACCESS_TOKEN_HOME,
      },
      'method': 'POST',
      'payload': JSON.stringify({
          'to': userId,
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

type RemindItem = {
  name: string;
  limit: string;
}

function sendOkResponse(userId: string, remindItems: RemindItem[]) {
  const url = LINE_API_PUSH_MESSAGE_URL;
  let body = 'リマインド一覧\n';

  if (remindItems && remindItems.length > 0) {
    for (let i = 0; i < remindItems.length; i++) {
      const remindItem = remindItems[i];
      const { name, limit } = remindItem;
      body += `  ${name}: ${limit}`;
    }
  } else {
    body += '  リストがありません';
  }
  try {
    UrlFetchApp.fetch(url, {
      'headers': {
          'Content-Type': 'application/json; charset=UTF-8',
          'Authorization': 'Bearer ' + LINE_CHANNEL_ACCESS_TOKEN_HOME,
      },
      'method': 'POST',
      'payload': JSON.stringify({
          'to': userId,
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

function getRemindItems(userNumber: number) {
  try {
    const url = FIREBASE_FUNCTIONS_REMIND_ITEMS_URL;
    const remindItems = UrlFetchApp.fetch(url, {
      'headers': {
          'Content-Type': 'application/json; charset=UTF-8',
      },
      'method': 'POST',
      'payload': JSON.stringify({
          'userNumber': userNumber
      })
    })
    console.log(remindItems);
    return remindItems;
  } catch (error) {
    console.log(error);
  }
}

function getUserNumber(userId: string) {
  const userNumber = userId === LINE_USER_1_ID
    ? 1
    : userId === LINE_USER_2_ID
      ? 2
      : 0;
  return userNumber;
}

function doPost(e: LineRequestPayload){
  const contents: LineRequestPostDataContent = JSON.parse(e.postData.contents);
  const userId = contents.events[0].source.userId;
  const groupId = contents.events[0].source.groupId;

  try {
    if (!validUserIdList.includes(userId)) {
      console.log("invalid user");
      // sendErrorResponse(userId);
    } else {
      console.log("valid user");
      const userNumber = getUserNumber(userId);
      const remindItems = getRemindItems(userNumber);
      sendOkResponse(userId, remindItems);
    }
  } catch (e: any) {
    const error = e as Error;
    const { message, stack } = error;
    console.log(e);
    sendErrorResponse(userId, message + '\n' + stack);
  }
}
