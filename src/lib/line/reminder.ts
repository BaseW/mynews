import {
  LineRequestPayload,
  LineRequestPostDataContent
} from "../../types";

const LINE_CHANNEL_ACCESS_TOKEN_NPB = PropertiesService.getScriptProperties().getProperty("LINE_CHANNEL_ACCESS_TOKEN_NPB");
const LINE_CHANNEL_ACCESS_TOKEN_HOME = PropertiesService.getScriptProperties().getProperty("LINE_CHANNEL_ACCESS_TOKEN_HOME");
const LINE_USER_ID = PropertiesService.getScriptProperties().getProperty("LINE_USER_ID");
const LINE_GROUP_ID = PropertiesService.getScriptProperties().getProperty("LINE_GROUP_ID");
const LINE_API_PUSH_MESSAGE_URL = "https://api.line.me/v2/bot/message/push";
const LINE_API_ADD_RICHMENU_URL = "https://api.line.me/v2/bot/richmenu";

const validUserIdList = [LINE_USER_ID];
// const validUserIdList = [];

function sendErrorResponse(userId: string) {
  const url = LINE_API_PUSH_MESSAGE_URL;
  const body = "Invalid Request";
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

function sendOkResponse(userId: string) {
  const url = LINE_API_PUSH_MESSAGE_URL;
  const body = "Valid Request";
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

function doPost(e: LineRequestPayload){
  const contents: LineRequestPostDataContent = JSON.parse(e.postData.contents);
  const userId = contents.events[0].source.userId;
  const groupId = contents.events[0].source.groupId;

  if (!validUserIdList.includes(userId)) {
    console.log("invalid user");
    sendErrorResponse(userId);
  } else {
    console.log("valid user");
    sendOkResponse(userId);
  }
}
