import { ResultType } from "../types";

const FIREBASE_FUNCTIONS_URL = PropertiesService.getScriptProperties().getProperty("FIREBASE_FUNCTIONS_URL");

/**
 * 試合情報の取得
 * @returns {ResultType}
 */
export function getGameInfo(): ResultType {
  const rawGameInfo: string = UrlFetchApp.fetch(FIREBASE_FUNCTIONS_URL).getContentText();
  const gameInfo: ResultType = JSON.parse(rawGameInfo);
  return gameInfo;
}
