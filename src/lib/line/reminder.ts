import {
  LINE_CHANNEL_ACCESS_TOKEN_NPB,
  LINE_CHANNEL_ACCESS_TOKEN_HOME,
  LINE_USER_ID,
  LINE_GROUP_ID,
} from "../../constants";
import {
  LineRequestPayload,
  LineRequestPostDataContent
} from "../../types";

function doPost(e: LineRequestPayload){
  const postData = e.postData;
  console.log(postData);
  const contents: LineRequestPostDataContent = JSON.parse(e.postData.contents);
  console.log(contents);
  // const UID = contents.events[0].source.userId;
  // const GID = contents.events[0].source.groupId;

  // var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  // sheet.getRange(1,1).setValue(UID);
  // sheet.getRange(2,1).setValue(GID);

}
