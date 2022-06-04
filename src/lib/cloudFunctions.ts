import { ResultType } from "../types";
import { FIREBASE_FUNCTIONS_URL } from "../constants";

/**
 * 試合情報の取得
 * @returns {ResultType}
 */
export function getGameInfo(): ResultType {
  const rawGameInfo: string = UrlFetchApp.fetch(FIREBASE_FUNCTIONS_URL).getContentText();
  const gameInfo: ResultType = JSON.parse(rawGameInfo);
  return gameInfo;
}
