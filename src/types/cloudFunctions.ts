export type GameInfo = {
  leftTeamName: string;
  rightTeamName: string;
  leftTeamScore: string;
  rightTeamScore: string;
  gameStateInfo: string;
}

export type ResultType = {
  dateInfo: string;
  gameInfoList: GameInfo[];
}
