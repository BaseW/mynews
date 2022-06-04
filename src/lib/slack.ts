import { SLACK_USER_ID, SLACK_WEBHOOK_URL } from "../constants";
import { ResultType, SlackBlockInfo, SlackPayloadType, GameInfo } from "../types";

/**
 * 試合情報の整理
 * @param {ResultType} fetchedResult
 * @returns {SlackPayloadType}
 */
export function organizeGameInfo(fetchedResult: ResultType): SlackPayloadType {
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
export function postToSlack(organizedGameInfo: SlackPayloadType) {
  const options = {
    'method' : 'post',
    'contentType': 'application/json',
    'payload' : JSON.stringify(organizedGameInfo)
  };
  const response = UrlFetchApp.fetch(SLACK_WEBHOOK_URL, options);
  console.log(response);
}
