import { GameInfo, ResultType } from "../../types";

/**
 * LINE 用のメッセージ整形
 * @param {ResultType} fetchedResult
 * @returns {string}
 */
export function organizeGameInfoForLine(fetchedResult: ResultType): string {
  const {
    dateInfo,
    gameInfoList,
  } = fetchedResult;
  let organizedGameInfoForLine = '';
  organizedGameInfoForLine += `${dateInfo}\n\n`;

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
  return organizedGameInfoForLine;
}

